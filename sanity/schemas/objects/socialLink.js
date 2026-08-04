// One footer social link (Instagram, Facebook, WhatsApp, TikTok, ...).
export default {
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'WhatsApp', 'YouTube', 'X'],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    },
  ],
  preview: {
    select: { title: 'platform', subtitle: 'url' },
  },
};
