// One image in a product's gallery — carries the FRONT/BACK/DETAIL/TEXTILE/STYLED
// view label that Product.jsx's ThumbStrip currently hardcodes.
export default {
  name: 'productImage',
  title: 'Product image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers and SEO.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'view',
      title: 'View',
      type: 'string',
      description: 'Which slot in the thumbnail strip this image fills.',
      options: {
        list: [
          { title: 'Front', value: 'FRONT' },
          { title: 'Back', value: 'BACK' },
          { title: 'Detail', value: 'DETAIL' },
          { title: 'Textile', value: 'TEXTILE' },
          { title: 'Styled', value: 'STYLED' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: { media: 'asset', title: 'view', subtitle: 'alt' },
  },
};
