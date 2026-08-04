// Lazy-loaded Sanity Studio route target. This file (and everything it
// imports — `sanity`, `sanity/structure`, `@sanity/vision`, the schemas,
// desk structure) is only ever pulled in via the dynamic `import()` in
// App.jsx, which keeps the Studio out of the storefront's main bundle.
//
// Toggles a `.studio-route` class on <body> while mounted so
// src/styles/global.css can scope its resets (button/a/img/input/`*`) away
// from Studio's own DOM — those global element selectors would otherwise
// cascade into Sanity UI's components and fight its styling, since Studio
// renders straight into this document rather than an iframe.
import { useEffect } from 'react';
import { Studio } from 'sanity';
import config from '../sanity.config.js';

export default function StudioPage() {
  useEffect(() => {
    // Also flagged on <html>: Studio's shell lays out against a definite
    // height, which has to come from the whole html -> body -> #root chain,
    // and a class on <body> alone can't reach the root element.
    document.documentElement.classList.add('studio-route');
    document.body.classList.add('studio-route');
    return () => {
      document.documentElement.classList.remove('studio-route');
      document.body.classList.remove('studio-route');
    };
  }, []);

  return <Studio config={config} />;
}
