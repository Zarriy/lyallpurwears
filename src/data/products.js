// Catalogue — Lyallpurwears. Prices in PKR.

export const CATEGORIES = [
  { slug: 'lawn', en: 'Lawn', ur: 'لان', tag: 'Featherweight cotton' },
  { slug: 'khaddar', en: 'Khaddar', ur: 'کھدر', tag: 'Hand-loomed' },
  { slug: 'linen', en: 'Linen', ur: 'لینن', tag: 'European weave' },
  { slug: 'dupatta', en: 'Dupatta', ur: 'دوپٹہ', tag: 'The finishing touch' },
];

export const COLORS = [
  { name: 'Ivory Rose', hex: '#F0E0D8' },
  { name: 'Sage', hex: '#B5BFA1' },
  { name: 'Saffron', hex: '#D4A04C' },
  { name: 'Charcoal', hex: '#3A3A3A' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const PRODUCTS = [
  {
    id: 1, slug: 'gulab', name: 'Gulab', urdu: 'گلاب',
    price: 8490, oldPrice: 10500, discount: 19, stock: 6, badge: 'New',
    fabric: '3 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser · Dupatta',
    rating: 4.9, reviews: 187,
    description: 'Gulab — Urdu for rose — is woven on a hand-loom in Lyallpur and finished beneath a block-printer\'s mallet in Multan. Featherweight, breathable, made for warm afternoons and cool evenings.',
    details: 'A 3-piece unstitched lawn in featherweight cotton, hand block-printed with our signature rose motif. Includes shirt (3.0m), trouser (2.5m) and dupatta (2.5m).',
  },
  {
    id: 2, slug: 'mehrunissa', name: 'Mehrunissa', urdu: null,
    price: 9290, oldPrice: 11500, discount: 19, stock: 3,
    fabric: '3 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser · Dupatta',
    rating: 4.8, reviews: 124,
    description: 'Named for the empress — a regal lawn in muted jade with a hand-carved paisley border that took our block-makers three weeks to cut.',
    details: '3-piece unstitched lawn. Shirt (3.0m), trouser (2.5m), dupatta (2.5m). Natural dyes throughout.',
  },
  {
    id: 3, slug: 'yasmin', name: 'Yasmin', urdu: 'یاسمین',
    price: 7990, oldPrice: null, stock: 12,
    fabric: '2 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser',
    rating: 4.7, reviews: 96,
    description: 'A jasmine-white two-piece with a scattered buti print — the quiet workhorse of a summer wardrobe.',
    details: '2-piece unstitched lawn. Shirt (3.0m), trouser (2.5m).',
  },
  {
    id: 4, slug: 'saba', name: 'Saba', urdu: null,
    price: 10490, oldPrice: null, stock: 4, badge: 'Limited',
    fabric: '3 Piece Khaddar', category: 'khaddar', pieces: 'Shirt · Trouser · Shawl',
    rating: 4.9, reviews: 72,
    description: 'Hand-loomed khaddar in a deep saffron, woven slow on pit-looms and softened with a stone wash.',
    details: '3-piece khaddar. Shirt (3.0m), trouser (2.5m), shawl (2.5m). Hand-loomed in Lyallpur.',
  },
  {
    id: 5, slug: 'roshni', name: 'Roshni', urdu: 'روشنی',
    price: 6790, oldPrice: 8500, discount: 20, stock: 2,
    fabric: '2 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser',
    rating: 4.6, reviews: 143,
    description: 'Roshni — light — is a sunrise-pink lawn with a fine gold block print along the hem.',
    details: '2-piece unstitched lawn. Shirt (3.0m), trouser (2.5m).',
  },
  {
    id: 6, slug: 'anaya', name: 'Anaya', urdu: null,
    price: 11790, oldPrice: null, stock: 8, badge: 'New',
    fabric: '3 Piece Linen', category: 'linen', pieces: 'Shirt · Trouser · Dupatta',
    rating: 4.8, reviews: 58,
    description: 'European-weave linen cut for the shoulder months — crisp in the day, soft by evening.',
    details: '3-piece linen. Shirt (3.0m), trouser (2.5m), dupatta (2.5m).',
  },
  {
    id: 7, slug: 'khushbu', name: 'Khushbu', urdu: 'خوشبو',
    price: 7290, oldPrice: null, stock: 14,
    fabric: '2 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser',
    rating: 4.7, reviews: 81,
    description: 'A powder-sage lawn with a trailing vine motif pressed from hundred-year-old blocks.',
    details: '2-piece unstitched lawn. Shirt (3.0m), trouser (2.5m).',
  },
  {
    id: 8, slug: 'mahnoor', name: 'Mahnoor', urdu: null,
    price: 12990, oldPrice: null, stock: 5,
    fabric: '3 Piece Linen', category: 'linen', pieces: 'Shirt · Trouser · Dupatta',
    rating: 4.9, reviews: 47,
    description: 'Moonlight-ivory linen with tonal embroidery at the neckline — our most requested formal.',
    details: '3-piece linen. Shirt (3.0m), trouser (2.5m), dupatta (2.5m). Tonal machine embroidery.',
  },
  {
    id: 9, slug: 'zeenat', name: 'Zeenat', urdu: 'زینت',
    price: 9890, oldPrice: null, stock: 7,
    fabric: '3 Piece Khaddar', category: 'khaddar', pieces: 'Shirt · Trouser · Shawl',
    rating: 4.6, reviews: 39,
    description: 'A winter khaddar in burnt henna, finished with a hand-knotted fringe on the shawl.',
    details: '3-piece khaddar. Shirt (3.0m), trouser (2.5m), shawl (2.5m).',
  },
  {
    id: 10, slug: 'chandni', name: 'Chandni', urdu: 'چاندنی',
    price: 4490, oldPrice: 5500, discount: 18, stock: 9,
    fabric: 'Dupatta', category: 'dupatta', pieces: 'Dupatta',
    rating: 4.8, reviews: 112,
    description: 'A silver-thread dupatta that catches lamplight the way its namesake catches the moon.',
    details: 'Pure lawn dupatta (2.5m) with woven silver zari border.',
  },
  {
    id: 11, slug: 'heer', name: 'Heer', urdu: 'ہیر',
    price: 5290, oldPrice: null, stock: 11, badge: 'New',
    fabric: 'Dupatta', category: 'dupatta', pieces: 'Dupatta',
    rating: 4.7, reviews: 64,
    description: 'Block-printed on both borders and hand-rolled at the edges — the Punjab romance, worn.',
    details: 'Pure lawn dupatta (2.5m), double-border block print, hand-rolled hem.',
  },
  {
    id: 12, slug: 'noor-jehan', name: 'Noor Jehan', urdu: 'نور جہاں',
    price: 13490, oldPrice: 15900, discount: 15, stock: 3, badge: 'Limited',
    fabric: '3 Piece Lawn', category: 'lawn', pieces: 'Shirt · Trouser · Dupatta',
    rating: 5.0, reviews: 29,
    description: 'The crown of the Mehfil edit — a twelve-screen print in wine and gold, numbered and limited to sixty pieces.',
    details: '3-piece unstitched lawn. Shirt (3.0m), trouser (2.5m), dupatta (2.5m). Numbered edition of 60.',
  },
];

export const formatPrice = (n) => `Rs. ${n.toLocaleString('en-PK')}`;

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug);

export const relatedProducts = (product, count = 4) =>
  PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, count);
