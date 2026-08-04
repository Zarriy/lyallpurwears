// Sanity Studio (v4) config, colocated in this repo at basePath '/studio'.
//
// This IS mounted inside the React app: src/App.jsx routes /studio/* to
// src/StudioPage.jsx, which renders <Studio config={this}> behind a lazy
// import so the admin bundle never loads for shoppers. Just `npm run dev`
// and visit /studio — see SANITY_SETUP.md.
//
// Sanity's standalone server (`npx sanity dev` → :3333) still works as an
// alternative, as do `sanity build` / `deploy` / `schema validate`.
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './sanity/schemas/index.js';
import { structure, SINGLETON_TYPES } from './sanity/deskStructure/index.js';

// This same config file is loaded two different ways:
//   1. By Vite (if/when a follow-up task mounts <Studio> inside the React
//      app) — `import.meta.env.VITE_*` is populated by Vite's define step.
//   2. By the standalone Sanity CLI (`sanity dev`, `sanity build`,
//      `sanity deploy`, `sanity schema validate`, ...) — the config is
//      loaded in a Node/CJS context via esbuild-register, where
//      `import.meta.env` does not exist (esbuild leaves `import.meta` as an
//      empty object under the "cjs" output format). The CLI instead loads
//      .env into `process.env` itself before requiring this file.
// Reading both, with import.meta.env preferred, keeps `npm run dev`
// (embedded, future) and `npx sanity dev`/`build`/`deploy` (standalone,
// today — see SANITY_SETUP.md) both working from the same VITE_-prefixed
// vars, without throwing when either global is absent.
const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const processEnv = typeof process !== 'undefined' && process.env ? process.env : {};

const projectId = metaEnv.VITE_SANITY_PROJECT_ID || processEnv.VITE_SANITY_PROJECT_ID;
const dataset = metaEnv.VITE_SANITY_DATASET || processEnv.VITE_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'lyallpurwears-studio',
  title: 'Lyallpurwears',
  basePath: '/studio',
  projectId,
  dataset,

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    // Singletons (siteSettings) shouldn't show up in the generic
    // "create new document" template picker — they're reached only via
    // the dedicated Site Settings entry in the desk structure.
    templates: (prev) => prev.filter((template) => !SINGLETON_TYPES.has(template.schemaType)),
  },

  document: {
    // Belt-and-braces alongside the `schema.templates` filter above: strip
    // singleton types out of the global "new document" affordances too.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => !SINGLETON_TYPES.has(item.templateId));
      }
      return prev;
    },
    // Singletons can only be published/discarded/restored — never
    // duplicated or deleted, so there is always exactly one siteSettings doc.
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
});
