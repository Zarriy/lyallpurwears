// One tile in the sitewide TrustStrip (Cash on Delivery / 7-Day Returns / etc).
export default {
  name: 'trustItem',
  title: 'Trust strip item',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Cash on Delivery".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g. "Pay when it arrives".',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle' },
  },
};
