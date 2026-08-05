// Schema registry — imported by sanity.config.js.
import category from './category.js';
import colour from './colour.jsx';
import order from './order.js';
import product from './product.js';
import review from './review.js';
import siteSettings from './siteSettings.js';
import voucher from './voucher.js';

// Reusable object types.
import seo from './objects/seo.js';
import productImage from './objects/productImage.js';
import shippingCell from './objects/shippingCell.js';
import trustItem from './objects/trustItem.js';
import socialLink from './objects/socialLink.js';

export const schemaTypes = [
  // documents
  category,
  colour,
  order,
  product,
  review,
  siteSettings,
  voucher,
  // objects
  seo,
  productImage,
  shippingCell,
  trustItem,
  socialLink,
];
