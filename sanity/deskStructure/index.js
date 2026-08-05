// Custom desk structure:
//   - Site Settings is pinned as a true singleton (no list, can't be duplicated/deleted — see sanity.config.js).
//   - Reviews gets a moderation-queue split: Pending approval vs Approved.
import {
  CogIcon,
  TagIcon,
  PackageIcon,
  ColorWheelIcon,
  CommentIcon,
  ClockIcon,
  CheckmarkCircleIcon,
  BasketIcon,
  RocketIcon,
  ArchiveIcon,
} from '@sanity/icons';

export const SINGLETON_TYPES = new Set(['siteSettings']);

export const structure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Singleton — editing goes straight to the one document, no list view.
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      S.listItem()
        .title('Products')
        .icon(PackageIcon)
        .child(S.documentTypeList('product').title('Products')),

      S.listItem()
        .title('Collections')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Collections')),

      S.listItem()
        .title('Colours')
        .icon(ColorWheelIcon)
        .child(S.documentTypeList('colour').title('Colours')),

      S.divider(),

      // Orders — a fulfilment queue, not a list. "To fulfil" is the only view
      // that matters day to day: everything not yet delivered, cancelled or
      // returned, oldest first so the longest-waiting customer surfaces first.
      S.listItem()
        .title('Orders')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Orders')
            .items([
              S.listItem()
                .title('To fulfil')
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title('To fulfil')
                    .schemaType('order')
                    .filter('_type == "order" && !(status in ["delivered", "cancelled", "returned"])')
                    .defaultOrdering([{ field: 'placedAt', direction: 'asc' }])
                ),
              S.listItem()
                .title('Shipped')
                .icon(RocketIcon)
                .child(
                  S.documentList()
                    .title('Shipped')
                    .schemaType('order')
                    .filter('_type == "order" && status == "shipped"')
                    .defaultOrdering([{ field: 'placedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Delivered')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Delivered')
                    .schemaType('order')
                    .filter('_type == "order" && status == "delivered"')
                    .defaultOrdering([{ field: 'placedAt', direction: 'desc' }])
                ),
              S.divider(),
              S.listItem()
                .title('All orders')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('order')
                    .title('All orders')
                    .defaultOrdering([{ field: 'placedAt', direction: 'desc' }])
                ),
            ])
        ),

      // Vouchers — issued once per confirmed subscriber, consumed once at
      // checkout. Read-only in practice; the useful views are "who has an
      // unspent code" and "which order burnt which code".
      S.listItem()
        .title('Vouchers')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Vouchers')
            .items([
              S.listItem()
                .title('Unused')
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title('Unused')
                    .schemaType('voucher')
                    .filter('_type == "voucher" && status == "issued"')
                    .defaultOrdering([{ field: 'issuedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Redeemed')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Redeemed')
                    .schemaType('voucher')
                    .filter('_type == "voucher" && status == "redeemed"')
                    .defaultOrdering([{ field: 'redeemedAt', direction: 'desc' }])
                ),
              S.divider(),
              S.listItem()
                .title('All vouchers')
                .child(S.documentTypeList('voucher').title('All vouchers')),
            ])
        ),

      S.divider(),

      // Reviews — moderation queue split. Pending approval is what staff
      // should be checking daily; Approved is the public-facing list.
      S.listItem()
        .title('Reviews')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Reviews')
            .items([
              S.listItem()
                .title('Pending approval')
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title('Pending approval')
                    .schemaType('review')
                    .filter('_type == "review" && approved != true')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Approved')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Approved')
                    .schemaType('review')
                    .filter('_type == "review" && approved == true')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              S.divider(),
              S.listItem()
                .title('All reviews')
                .child(S.documentTypeList('review').title('All reviews')),
            ])
        ),

      // Anything else registered in the schema that isn't handled above
      // (defensive — keeps new document types from disappearing silently).
      ...S.documentTypeListItems().filter(
        (item) => !['siteSettings', 'product', 'category', 'colour', 'review', 'order', 'voucher'].includes(item.getId())
      ),
    ]);
