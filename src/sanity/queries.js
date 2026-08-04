// GROQ queries. Reviews are ALWAYS filtered to approved == true here — the
// moderation queue in Studio (Reviews > Pending approval) is the only place
// unapproved reviews are ever visible.

const CATEGORY_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  urdu,
  tagline,
  description,
  heroImage,
  displayOrder
`;

const PRODUCT_CARD_FIELDS = /* groq */ `
  _id,
  name,
  urdu,
  "slug": slug.current,
  productNumber,
  price,
  oldPrice,
  stock,
  badge,
  fabric,
  pieces,
  images,
  featured,
  displayOrder,
  "category": category->{ _id, title, "slug": slug.current }
`;

export const ALL_PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(displayOrder asc, productNumber asc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const ALL_CATEGORIES_QUERY = /* groq */ `
  *[_type == "category"] | order(displayOrder asc, title asc) {
    ${CATEGORY_FIELDS}
  }
`;

// Single product by slug: every field, category + colours resolved, plus
// its APPROVED reviews only. relatedProducts resolved so a manual override
// doesn't require a second round trip.
export const PRODUCT_BY_SLUG_QUERY = /* groq */ `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    urdu,
    "slug": slug.current,
    productNumber,
    price,
    oldPrice,
    stock,
    badge,
    editionLabel,
    fabric,
    pieces,
    images,
    colours[]->{ _id, name, hex },
    sizes,
    unstitchedNote,
    description,
    details,
    careInstructions,
    shippingReturns,
    featured,
    displayOrder,
    seo,
    "category": category->{ _id, title, "slug": slug.current, urdu, tagline },
    "relatedProducts": relatedProducts[]->{ ${PRODUCT_CARD_FIELDS} },
    "reviews": *[_type == "review" && approved == true && references(^._id)] | order(submittedAt desc) {
      _id,
      authorName,
      city,
      rating,
      title,
      text,
      photos,
      verified,
      submittedAt
    }
  }
`;

export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    brandName,
    tagline,
    announcementText,
    contactEmail,
    contactPhone,
    contactAddress,
    contactAddressNote,
    contactHours,
    socialLinks,
    footerCopy,
    "homepageCollections": homepageCollections[]->{ ${CATEGORY_FIELDS} },
    "featuredCollection": featuredCollection->{ ${CATEGORY_FIELDS} },
    featuredCollectionLimit,
    collectionsIntro,
    freeShippingThreshold,
    shippingCells,
    trustStripItems,
    defaultEditionLabel,
    seasonLabel,
    sizeGuideUrl,
    stockUrgencyTemplate,
    viewingNowTemplate,
    viewingNowCount,
    defaultCareInstructions,
    defaultShippingReturns
  }
`;
