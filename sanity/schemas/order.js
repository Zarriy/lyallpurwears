// Orders placed through checkout. Written server-side only, by
// netlify/functions/order.js — never by the browser, which is why there is no
// public mutation path to this type.
//
// Before this existed, completing checkout ran a setTimeout, invented an order
// number and cleared the cart. Nothing was stored anywhere: a COD order left
// no record of what was bought or where to deliver it.
//
// Money fields are snapshots in PKR taken at the moment of ordering, not
// references to live product prices. A price change next week must not
// retroactively alter what someone already agreed to pay.
import { OrderSummary } from './components/OrderSummary.jsx';

export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  // Newest first — this is a work queue, not a catalogue.
  orderings: [
    {
      title: 'Newest first',
      name: 'placedAtDesc',
      by: [{ field: 'placedAt', direction: 'desc' }],
    },
  ],
  // Tabs rather than one long scroll. Fulfilment is the daily job, so it
  // opens first; the captured detail sits behind it, read-only.
  groups: [
    { name: 'fulfilment', title: 'Fulfilment', default: true },
    { name: 'details', title: 'Order details' },
  ],
  fields: [
    {
      // Read-only docket rendered at the top of both tabs' parent form — who,
      // what, where, and the cash figure, without hunting through fields.
      name: 'summary',
      title: 'Summary',
      type: 'string',
      group: ['fulfilment', 'details'],
      components: { field: OrderSummary },
    },
    {
      name: 'orderNumber',
      group: 'details',
      title: 'Order number',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'fulfilment',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Packed', value: 'packed' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Returned', value: 'returned' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'placedAt',
      group: 'details',
      title: 'Placed at',
      type: 'datetime',
      readOnly: true,
    },

    // --- Customer -----------------------------------------------------
    {
      name: 'customer',
      group: 'details',
      title: 'Customer',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'firstName', title: 'First name', type: 'string' },
        { name: 'lastName', title: 'Last name', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'phone', title: 'Phone / WhatsApp', type: 'string' },
      ],
    },
    {
      name: 'shippingAddress',
      group: 'details',
      title: 'Shipping address',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'address', title: 'Address', type: 'string' },
        { name: 'apartment', title: 'Apartment / suite', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'postalCode', title: 'Postal code', type: 'string' },
        { name: 'country', title: 'Country', type: 'string', initialValue: 'Pakistan' },
      ],
    },

    // --- What was bought ----------------------------------------------
    {
      name: 'lines',
      group: 'details',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productName', title: 'Product', type: 'string' },
            { name: 'productSlug', title: 'Slug', type: 'string' },
            // Not a reference: a product deleted or renamed later must not
            // corrupt the historical record of what shipped.
            { name: 'productId', title: 'Product id', type: 'string' },
            { name: 'fabric', title: 'Fabric', type: 'string' },
            { name: 'stitching', title: 'Stitching', type: 'string', description: '"Unstitched" or the stitched size ordered.' },
            { name: 'colour', title: 'Colour', type: 'string' },
            { name: 'qty', title: 'Qty', type: 'number' },
            { name: 'unitPrice', title: 'Unit price (PKR)', type: 'number' },
            { name: 'lineTotal', title: 'Line total (PKR)', type: 'number' },
          ],
          preview: {
            select: { title: 'productName', qty: 'qty', stitching: 'stitching', total: 'lineTotal' },
            prepare: ({ title, qty, stitching, total }) => ({
              title: `${qty || 1} × ${title || 'Item'}`,
              subtitle: [stitching, total != null ? `Rs. ${total.toLocaleString('en-PK')}` : null].filter(Boolean).join(' · '),
            }),
          },
        },
      ],
    },

    // --- Money ---------------------------------------------------------
    { group: 'details', name: 'subtotal', title: 'Subtotal (PKR)', type: 'number' },
    { group: 'details', name: 'discountCode', title: 'Discount code', type: 'string' },
    { group: 'details', name: 'discountAmount', title: 'Discount (PKR)', type: 'number' },
    { group: 'details', name: 'shipping', title: 'Shipping (PKR)', type: 'number' },
    { group: 'details', name: 'taxes', title: 'Taxes (PKR)', type: 'number' },
    {
      name: 'total',
      group: 'details',
      title: 'Total (PKR)',
      type: 'number',
      description: 'What the rider collects on delivery for a COD order.',
    },
    {
      name: 'paymentMethod',
      group: 'details',
      title: 'Payment method',
      type: 'string',
      initialValue: 'cod',
      options: {
        list: [
          { title: 'Cash on Delivery', value: 'cod' },
          { title: 'Bank transfer', value: 'bank' },
          { title: 'Card', value: 'card' },
        ],
      },
    },

    // --- Fulfilment -----------------------------------------------------
    {
      name: 'trackingNumber',
      title: 'Tracking number',
      type: 'string',
      group: 'fulfilment',
      description: 'Courier consignment number, once dispatched.',
    },
    {
      name: 'notes',
      title: 'Internal notes',
      type: 'text',
      group: 'fulfilment',
      rows: 3,
      description: 'Not shown to the customer.',
    },
    {
      // Written by netlify/functions/order.js after it tries to email the
      // customer. Recorded on the order rather than only logged, because a
      // failed confirmation means the customer has no record of what they
      // bought — that has to be visible next to the order it concerns.
      name: 'confirmationEmail',
      title: 'Confirmation email',
      type: 'object',
      group: 'fulfilment',
      readOnly: true,
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: 'status',
          title: 'Status',
          type: 'string',
          options: { list: [{ title: 'Sent', value: 'sent' }, { title: 'Failed', value: 'failed' }] },
        },
        { name: 'provider', title: 'Sent via', type: 'string' },
        { name: 'sentAt', title: 'Attempted at', type: 'datetime' },
        { name: 'error', title: 'Error', type: 'text', rows: 3 },
      ],
    },
  ],

  preview: {
    select: {
      orderNumber: 'orderNumber',
      status: 'status',
      first: 'customer.firstName',
      last: 'customer.lastName',
      city: 'shippingAddress.city',
      total: 'total',
    },
    prepare: ({ orderNumber, status, first, last, city, total }) => {
      const who = [first, last].filter(Boolean).join(' ') || 'Customer';
      return {
        title: `${orderNumber || 'Order'} — ${who}`,
        subtitle: [
          status ? status.toUpperCase() : null,
          city,
          total != null ? `Rs. ${total.toLocaleString('en-PK')}` : null,
        ]
          .filter(Boolean)
          .join(' · '),
      };
    },
  },
};
