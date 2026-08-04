// Reusable SEO object — attached to product (and could be reused elsewhere).
export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Overrides the page <title>. Falls back to the product name when empty.',
      validation: (Rule) => Rule.max(70).warning('Search engines typically truncate titles beyond ~70 characters.'),
    },
    {
      name: 'description',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Search engines typically truncate descriptions beyond ~160 characters.'),
    },
  ],
  options: { collapsible: true, collapsed: true },
};
