// Admin Configuration - Edit these values to control the website

export const siteConfig = {
  // Business Info
  businessName: 'Ionic',
  whatsappNumber: '+447857038584',

  // Pricing Settings
  showPricing: true, // Set to false to hide all pricing
  currency: '£',

  // Prices per item (adjust as needed)
  pricing: {
    shirt: {
      base: 25, // Base price per shirt
      // Additional costs per feature
      customLogo: 5,
      customText: 3,
      premiumPattern: 5,
    },
    pants: {
      base: 20, // Base price per pants
      customLogo: 5,
      customText: 3,
      premiumPattern: 5,
    },
  },

  // Quantity discounts (percentage off)
  quantityDiscounts: [
    { minQty: 10, discount: 5 },   // 5% off for 10+ items
    { minQty: 25, discount: 10 },  // 10% off for 25+ items
    { minQty: 50, discount: 15 },  // 15% off for 50+ items
    { minQty: 100, discount: 20 }, // 20% off for 100+ items
  ],

  // Available sizes
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
}
