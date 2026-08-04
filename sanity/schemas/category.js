// Storefront calls these "collections" (see src/pages/Collections.jsx and
// src/data/products.js CATEGORIES) — labelled "Collection" in the Studio UI
// per the task brief, but the schema `name` stays `category` since that's
// the reference type name products point to.
export default {
  name: 'category',
  title: 'Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Lawn", "Khaddar", "Linen", "Dupatta".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'urdu',
      title: 'Urdu name',
      type: 'string',
      description: 'e.g. "لان" — shown beside the English title on the collection page.',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'e.g. "Featherweight cotton", "Hand-loomed".',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
    {
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers sort first in collection navigation.',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'heroImage' },
  },
};
