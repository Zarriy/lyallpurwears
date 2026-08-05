// Drives everything on the PDP (src/pages/Product.jsx) and the product card
// (src/components/ProductCard.jsx). `discount` is intentionally NOT a field
// here — it's derived from price/oldPrice in src/sanity/normalize.js so it
// can never drift out of sync with the two source numbers.
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'media', title: 'Images' },
    { name: 'variants', title: 'Variants' },
    { name: 'copy', title: 'Copy' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'main',
      description: 'e.g. "Gulab", "Mehrunissa".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'urdu',
      title: 'Urdu name',
      type: 'string',
      group: 'main',
      description: 'e.g. "گلاب". Optional — several products in the catalogue have none.',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'productNumber',
      title: 'Product number',
      type: 'number',
      group: 'main',
      description: 'Drives the "№ 01" badge on the card and PDP hero. Keep these unique.',
      validation: (Rule) => Rule.required().integer().positive(),
    },
    {
      name: 'category',
      title: 'Collection',
      type: 'reference',
      group: 'main',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'fabric',
      title: 'Fabric',
      type: 'string',
      group: 'main',
      description: 'e.g. "3 Piece Lawn", "2 Piece Lawn", "3 Piece Khaddar", "Dupatta".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'pieces',
      title: 'Pieces',
      type: 'string',
      group: 'main',
      description: 'e.g. "Shirt · Trouser · Dupatta".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (PKR)',
      type: 'number',
      group: 'main',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'oldPrice',
      title: 'Old price (PKR)',
      type: 'number',
      group: 'main',
      description: 'Optional — set only when this product is discounted. Must be greater than Price.',
      validation: (Rule) =>
        Rule.positive().custom((oldPrice, context) => {
          if (oldPrice == null) return true;
          const price = context.document?.price;
          if (typeof price === 'number' && oldPrice <= price) {
            return 'Old price must be greater than the current price.';
          }
          return true;
        }),
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      group: 'main',
      description: 'Drives the stock-urgency strip and "Only N pieces left" copy.',
      validation: (Rule) => Rule.required().integer().min(0),
    },
    {
      name: 'badge',
      title: 'Badge',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'New', value: 'New' },
          { title: 'Limited', value: 'Limited' },
          { title: 'Sold Out', value: 'Sold Out' },
        ],
      },
    },
    {
      name: 'editionLabel',
      title: 'Edition label',
      type: 'string',
      group: 'main',
      description: 'e.g. "Mehfil Edit" — shown above the product title on the PDP. Falls back to Site Settings default when empty (see siteSettings.defaultEditionLabel).',
      initialValue: 'Mehfil Edit',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      of: [{ type: 'productImage' }],
      description: 'Populate the FRONT / BACK / DETAIL / TEXTILE / STYLED thumb strip.',
      validation: (Rule) => Rule.min(1),
    },
    {
      name: 'colours',
      title: 'Colours',
      type: 'array',
      group: 'variants',
      of: [{ type: 'reference', to: [{ type: 'colour' }] }],
    },
    {
      name: 'sizes',
      title: 'Stitched sizes',
      type: 'array',
      group: 'variants',
      of: [{ type: 'string' }],
      options: {
        list: ['XS', 'S', 'M', 'L', 'XL'],
      },
      description:
        'Sizes offered on the optional stitching service. The article always ships unstitched by default — the storefront shows an "Unstitched" option first and only offers these sizes if you list any. Leave empty for cloth you will not stitch.',
    },
    {
      name: 'unstitchedNote',
      title: 'Stitching note',
      type: 'string',
      group: 'variants',
      description:
        'Shown under the size selector once a stitched size is picked, e.g. "Stitched to measure · +Rs. 1,200". Field name is legacy — it used to hold the reverse ("Or order unstitched…") back when the storefront treated stitched as the default.',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'copy',
      rows: 4,
      description: 'The poetic paragraph under the product title.',
    },
    {
      name: 'details',
      title: 'Description (accordion)',
      type: 'text',
      group: 'copy',
      rows: 4,
      description: 'Body text for the "Description" accordion item (fabric composition, meterage, etc).',
    },
    {
      name: 'careInstructions',
      title: 'Care instructions',
      type: 'text',
      group: 'copy',
      rows: 3,
      description: 'Body for the "Care Instructions" accordion item. Falls back to Site Settings default when empty.',
    },
    {
      name: 'shippingReturns',
      title: 'Shipping & returns',
      type: 'text',
      group: 'copy',
      rows: 3,
      description: 'Body for the "Shipping & Returns" accordion item. Falls back to Site Settings default when empty.',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'main',
      initialValue: false,
      description: 'Featured products can be surfaced on the homepage hero/grid.',
    },
    {
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      group: 'main',
      initialValue: 0,
    },
    {
      name: 'relatedProducts',
      title: 'Related products',
      type: 'array',
      group: 'variants',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Optional manual override for "You may also love". Falls back to same-collection matching when empty.',
      validation: (Rule) => Rule.unique(),
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    },
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Product number',
      name: 'productNumberAsc',
      by: [{ field: 'productNumber', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'fabric', media: 'images.0' },
  },
};
