// In-memory store for development without MongoDB
const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, 'storeSettings.json');

const loadSettings = () => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch (err) { console.error('Error loading settings:', err); }
  return {
    logoMain: 'Saadat Shawl House',
    logoSub: 'Authentic Kashmiri Shawls',
    logoUrl: null,
    phoneNumber: '(+91) 94190 12345',
    email: 'support@kashurmart.com',
    address: 'Srinagar, Jammu & Kashmir, India',
    aboutText: 'Handcrafted shawls from the valleys of Kashmir. Each piece tells a story of tradition, artistry & warmth passed through generations.',
    announcementText: 'Free shipping & 30-day returns — Authentic Crafts',
    banners: [
      {
        _id: 'b1',
        title: 'Wear the Art of Kashmir',
        subtitle: 'Sale up to 40% off',
        description: 'Discover handwoven shawls crafted by master artisans in the heart of the Kashmir Valley. Every thread carries centuries of tradition.',
        image: 'https://images.unsplash.com/photo-1563161439-04f4892c67bd?w=1000&q=80',
        btnText: 'Shop Now',
        btnLink: '/shop'
      },
      {
        _id: 'b2',
        title: 'Legendary Pashmina Collection',
        subtitle: 'New Season Arrival',
        description: 'Pure, authentic Pashmina fibers sourced from the high altitudes of Ladakh. Experience the warmth of tradition.',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&q=80',
        btnText: 'Explore Pashmina',
        btnLink: '/shop?category=mock_cat_1'
      },
      {
        _id: 'b3',
        title: 'Masterful Embroidery',
        subtitle: 'GI-Certified Crafts',
        description: 'Intricate Sozni and Kani stitch patterns that have adorned royalty for centuries. Own a piece of history.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&q=80',
        btnText: 'View Designs',
        btnLink: '/shop?featured=true'
      }
    ]
  };
};

let categories = [
  { _id: 'mock_cat_1', name: 'Pashmina Shawls', slug: 'pashmina-shawls', description: 'Legendary handwoven shawls.', isActive: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&q=80' },
  { _id: 'mock_cat_2', name: 'Stoles', slug: 'stoles', description: 'Elegant light-weight stoles.', isActive: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1000&q=80' },
  { _id: 'mock_cat_3', name: 'Woolen Wraps', slug: 'woolen-wraps', description: 'Warm and cozy woolen wraps.', isActive: true, showInNavbar: true, image: 'https://images.unsplash.com/photo-1520006403993-47400cad673e?w=1000&q=80' }
];

let products = [
  { 
    _id: 'mock_prod_1', 
    name: 'Premium Walnut Shawl', 
    slug: 'walnut-shawl', 
    description: 'A luxurious handwoven shawl made from the finest walnut-dyed wool. Featuring intricate traditional patterns and exceptional warmth, this masterpiece represents the pinnacle of Kashmiri craftsmanship.',
    price: 12500, 
    comparePrice: 15500,
    stock: 10, 
    category: categories[0], 
    isActive: true, 
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&q=80'],
    variants: [
      { color: 'Walnut Brown', size: 'Full Size', material: 'Pure Wool', price: 12500, stock: 5 },
      { color: 'Dark Chocolate', size: 'Full Size', material: 'Pure Wool', price: 12500, stock: 5 }
    ]
  },
  { 
    _id: 'mock_prod_2', 
    name: 'Crimson Embroidered Stole', 
    slug: 'crimson-stole', 
    description: 'Elegant light-weight stole with delicate crimson embroidery. Perfect for evening wear or as a sophisticated accent to any outfit.',
    price: 4500, 
    comparePrice: 5800,
    stock: 25, 
    category: categories[1], 
    isActive: true, 
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1000&q=80'],
    variants: [
      { color: 'Crimson Red', size: 'Standard', material: 'Silk Blend', price: 4500, stock: 25 }
    ]
  },
  { 
    _id: 'mock_prod_3', 
    name: 'Silver Mist Pashmina', 
    slug: 'silver-mist-pashmina', 
    description: 'A ethereal silver-grey Pashmina shawl, hand-spun and hand-woven in the heart of Kashmir. Known for its incredible softness and lightweight warmth.',
    price: 18500, 
    comparePrice: 22000,
    stock: 5, 
    category: categories[0], 
    isActive: true, 
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1574169208507-84376144848b?w=1000&q=80'],
    variants: [
      { color: 'Silver Grey', size: 'Full Size', material: 'Pure Pashmina', price: 18500, stock: 5 }
    ]
  },
  { 
    _id: 'mock_prod_4', 
    name: 'Antique Kani Silk Shawl', 
    slug: 'kani-silk-shawl', 
    description: 'A masterpiece of patience and skill. Kani shawls are created using small eye-less wooden bobbins called "Kanis". This silk-blend piece features a timeless multicolor floral pattern.',
    price: 24500, 
    comparePrice: 32000,
    stock: 2, 
    category: categories[0], 
    isActive: true, 
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&q=80'],
    variants: [
      { color: 'Multicolor', size: 'Full Size', material: 'Silk & Wool', price: 24500, stock: 2 }
    ]
  },
  { 
    _id: 'mock_prod_5', 
    name: 'Midnight Embroidered Poncho', 
    slug: 'embroidered-poncho', 
    description: 'A modern take on traditional Kashmiri embroidery. This warm woolen poncho features intricate white thread-work on a deep midnight blue base.',
    price: 6800, 
    comparePrice: 8500,
    stock: 12, 
    category: categories[2], 
    isActive: true, 
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1520013817300-1f4c1ca245ef?w=1000&q=80'],
    variants: [
      { color: 'Midnight Blue', size: 'Free Size', material: 'Crafted Wool', price: 6800, stock: 12 }
    ]
  }
];


let orders = [];
let messages = [{
  _id: 'mock_msg_1',
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Just testing the contact form. Looks great!',
  isRead: false,
  createdAt: new Date().toISOString()
}];

let shippingZones = [
  { _id: 'mock_zone_1', name: 'Kashmir Valley', pincodes: ['190', '191', '192', '193'], rate: 0, estimatedDays: '2-4 business days', isFree: true },
  { _id: 'mock_zone_2', name: 'Rest of India', pincodes: ['110', '400', '560', '600', '700'], rate: 150, estimatedDays: '5-7 business days', isFree: false }
];

let storeSettings = loadSettings();

module.exports = {
  categories,
  products,
  orders,
  shippingZones,
  storeSettings,
  messages,
  // Helper to add data
  updateSettings: (data) => {
    Object.assign(storeSettings, data);
    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(storeSettings, null, 2));
    } catch (err) { console.error('Error saving settings:', err); }
    return storeSettings;
  },
  addCategory: (cat) => {
    const newCat = { 
      ...cat,
      _id: `mock_cat_${Date.now()}`, 
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'), 
      isActive: true,
      showInNavbar: cat.showInNavbar !== undefined ? cat.showInNavbar : true
    };
    categories.push(newCat);
    return newCat;
  },
  deleteCategory: (id) => {
    const index = categories.findIndex(c => c._id === id);
    if (index !== -1) categories.splice(index, 1);
  },
  updateCategory: (id, data) => {
    const cat = categories.find(c => c._id === id);
    if (cat) Object.assign(cat, data);
    return cat;
  },
  addProduct: (prod) => {
    const newProd = { ...prod, _id: `mock_prod_${Date.now()}`, slug: prod.name.toLowerCase().replace(/\s+/g, '-'), isActive: true };
    newProd.category = categories.find(c => c._id === prod.category) || categories[0];
    products.push(newProd);
    return newProd;
  },
  updateProduct: (id, data) => {
    const prod = products.find(p => p._id === id);
    if (prod) {
      Object.assign(prod, data);
      // Re-resolve category if id changed
      if (data.category && typeof data.category === 'string') {
        prod.category = categories.find(c => c._id === data.category) || categories[0];
      }
    }
    return prod;
  },
  deleteProduct: (id) => {
    const index = products.findIndex(p => p._id === id);
    if (index !== -1) products.splice(index, 1);
  },
  addShippingZone: (zone) => {
    const newZone = { ...zone, _id: `mock_zone_${Date.now()}` };
    shippingZones.push(newZone);
    return newZone;
  },
  updateShippingZone: (id, data) => {
    const zone = shippingZones.find(z => z._id === id);
    if (zone) Object.assign(zone, data);
    return zone;
  },
  deleteShippingZone: (id) => {
    const index = shippingZones.findIndex(z => z._id === id);
    if (index !== -1) shippingZones.splice(index, 1);
  },
  addOrder: (order) => {
    const newOrder = { 
      ...order, 
      _id: `mock_order_${Date.now()}`, 
      status: 'pending', 
      createdAt: new Date(), 
      orderNumber: `KM-${Math.floor(1000 + Math.random() * 9000)}` 
    };
    orders.push(newOrder);
    return newOrder;
  },
  updateOrder: (id, data) => {
    const order = orders.find(o => o._id === id);
    if (order) Object.assign(order, data);
    return order;
  },
  
  // Mock Messages
  addMessage: (msg) => {
    const newMsg = { ...msg, _id: `mock_msg_${Date.now()}`, isRead: false, createdAt: new Date().toISOString() };
    messages.push(newMsg);
    return newMsg;
  },
  updateMessageRead: (id) => {
    const msg = messages.find(m => m._id === id);
    if (msg) msg.isRead = !msg.isRead;
    return msg;
  },
  deleteMessage: (id) => {
    const index = messages.findIndex(m => m._id === id);
    if (index !== -1) messages.splice(index, 1);
  },

  // Mock User / Admin Profile persist
  mockUser: {
    _id: 'mock_admin',
    name: 'Mock Admin',
    email: 'admin@kashur.com',
    password: 'admin123', // Raw for mock simplicity
    isAdmin: true
  },
  mockResetTokens: {},
  
  updateMockUser: (data) => {
    Object.assign(module.exports.mockUser, data);
    return module.exports.mockUser;
  }
};
