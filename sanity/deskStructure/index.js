// Custom desk structure:
//   - Site Settings is pinned as a true singleton (no list, can't be duplicated/deleted — see sanity.config.js).
//   - Reviews gets a moderation-queue split: Pending approval vs Approved.
import { CogIcon, TagIcon, PackageIcon, ColorWheelIcon, CommentIcon, ClockIcon, CheckmarkCircleIcon } from '@sanity/icons';

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
        (item) => !['siteSettings', 'product', 'category', 'colour', 'review'].includes(item.getId())
      ),
    ]);
