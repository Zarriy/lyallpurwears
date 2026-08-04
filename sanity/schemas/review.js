// Customer reviews. `approved` is the moderation gate — the storefront
// query (src/sanity/queries.js) only ever reads approved == true, and the
// public submission endpoint (api/submit-review.js) can never set it true.
export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      description: 'e.g. "Karachi", "Lahore".',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'text',
      title: 'Review text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(2000),
    },
    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'verified',
      title: 'Verified buyer',
      type: 'boolean',
      initialValue: false,
      description: 'Never settable by the public submission form — set manually by staff after confirming a real purchase.',
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'MODERATION GATE. Only approved reviews are ever shown on the storefront. New submissions always arrive with this false.',
    },
    {
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'authorName', rating: 'rating', approved: 'approved', productName: 'product.name' },
    prepare({ title, rating, approved, productName }) {
      const stars = '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));
      return {
        title: `${title} — ${stars}`,
        subtitle: `${approved ? 'Approved' : 'Pending approval'}${productName ? ` · ${productName}` : ''}`,
      };
    },
  },
};
