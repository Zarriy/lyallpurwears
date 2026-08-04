// One cell in the PDP's 4-cell shipping panel (COD / Free shipping / Returns / Authentic Lawn).
export default {
  name: 'shippingCell',
  title: 'Shipping panel cell',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "Cash on Delivery", "Free shipping".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sublabel',
      title: 'Sublabel',
      type: 'string',
      description: 'e.g. "Pay when it arrives", "Orders over Rs. 5,000".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'kind',
      title: 'Style / kind',
      type: 'string',
      description: 'Controls which icon/badge the storefront renders for this cell.',
      options: {
        list: [
          { title: 'Cash on Delivery badge', value: 'cod' },
          { title: 'Shipping box icon', value: 'shipping' },
          { title: 'Returns icon', value: 'returns' },
          { title: 'Authenticity icon', value: 'authentic' },
        ],
      },
      initialValue: 'shipping',
    },
  ],
  preview: {
    select: { title: 'label', subtitle: 'sublabel' },
  },
};
