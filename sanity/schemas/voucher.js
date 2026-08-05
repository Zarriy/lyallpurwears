// Single-use discount vouchers, one per subscriber.
//
// Replaced a single shared code in an env var (VOUCHER_CODE=PEHLA500) that any
// number of people could use any number of times — it could be posted to a
// deals group and redeemed a thousand times with nothing to stop it.
//
// Written server-side only: minted by netlify/functions/voucher.js when a
// confirmed subscriber lands on /welcome, and claimed by
// netlify/functions/order.js at checkout. There is no public mutation path.
//
// `status` is the whole point of the document. It moves issued -> redeemed
// exactly once, guarded by an optimistic-concurrency check on _rev so two
// simultaneous checkouts cannot both win.
export default {
  name: 'voucher',
  title: 'Voucher',
  type: 'document',
  orderings: [
    { title: 'Newest first', name: 'issuedAtDesc', by: [{ field: 'issuedAt', direction: 'desc' }] },
  ],
  fields: [
    {
      name: 'code',
      title: 'Code',
      type: 'string',
      readOnly: true,
      description: 'Unique per subscriber. Generated, never typed by hand.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Issued to',
      type: 'string',
      readOnly: true,
      description: 'The subscriber this code belongs to. One live code per address.',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'issued',
      options: {
        list: [
          { title: 'Issued — not yet used', value: 'issued' },
          { title: 'Redeemed', value: 'redeemed' },
          { title: 'Void — cancelled by us', value: 'void' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },

    { name: 'amount', title: 'Value (PKR)', type: 'number', readOnly: true },
    { name: 'minSpend', title: 'Minimum spend (PKR)', type: 'number', readOnly: true },

    { name: 'issuedAt', title: 'Issued at', type: 'datetime', readOnly: true },
    {
      name: 'expiresAt',
      title: 'Expires at',
      type: 'datetime',
      description: 'After this, the code stops working. Editable if you want to extend a goodwill case.',
    },

    { name: 'redeemedAt', title: 'Redeemed at', type: 'datetime', readOnly: true },
    {
      name: 'redeemedOrderNumber',
      title: 'Redeemed on order',
      type: 'string',
      readOnly: true,
      description: 'Which order consumed it — the audit trail.',
    },

    {
      name: 'source',
      title: 'Source',
      type: 'string',
      readOnly: true,
      description: 'How it was issued, e.g. "welcome-signup".',
    },
  ],

  preview: {
    select: { code: 'code', email: 'email', status: 'status', amount: 'amount', order: 'redeemedOrderNumber' },
    prepare: ({ code, email, status, amount, order }) => ({
      title: `${code}${amount != null ? ` — Rs. ${amount}` : ''}`,
      subtitle: [status ? status.toUpperCase() : null, email, order].filter(Boolean).join(' · '),
    }),
  },
};
