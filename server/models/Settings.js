/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  logoMain: { type: String, default: 'Saadat Shawl House' },
  logoSub: { type: String, default: 'Authentic Kashmiri Shawls' },
  logoUrl: { type: String, default: null }, // Store Cloudinary URL here
  faviconUrl: { type: String, default: null }, // Store Cloudinary URL for favicon
  phoneNumber: { type: String, default: '(+91) 94190 12345' },
  email: { type: String, default: 'support@kashurmart.com' },
  address: { type: String, default: 'Srinagar, Jammu & Kashmir, India' },
  aboutText: { type: String, default: 'Handcrafted shawls from the valleys of Kashmir. Each piece tells a story of tradition, artistry & warmth passed through generations.' },
  announcementText: { type: String, default: 'Free shipping & 30-day returns — Authentic Crafts' },
  banners: [
    {
      image: { type: String, default: 'https://images.unsplash.com/photo-1563161439-04f4892c67bd?w=1000&q=80' },
      mobileImage: { type: String, default: '' },
      title: { type: String, default: 'Wear the Art of Kashmir' },
      subtitle: { type: String, default: 'Sale up to 40% off' },
      description: { type: String, default: 'Discover handwoven shawls crafted by master artisans in the heart of the Kashmir Valley.' },
      btnText: { type: String, default: 'Shop Now' },
      btnLink: { type: String, default: '/shop' }
    }
  ],
  aboutPage: {
    heroImage: { type: String, default: 'https://images.unsplash.com/photo-1549463991-032899479b00?w=1600&q=80' },
    heroSubtitle: { type: String, default: 'The Heritage of the Himalayas' },
    heroTitle: { type: String, default: 'Artistry Without Compromise' },
    chapterTitle: { type: String, default: 'Chapter I. A Journey to Creation' },
    chapterText1: { type: String, default: 'At Saadat Shawl House, we do not merely sell garments; we are the modern custodians of an ancient craft. Since our inception, we have championed the preservation of traditional Kashmiri artisanship, ensuring that techniques dating back to the 15th century remain breathtakingly relevant today.' },
    chapterText2: { type: String, default: 'True luxury takes time. From the perilous high altitudes where the finest Cashmere is hand-combed, to the rhythmic clicking of the handlooms in the valley—every thread is a testament to extraordinary human patience.' },
    chapterImage: { type: String, default: 'https://images.unsplash.com/photo-1621217036239-0efc23579dc5?w=1000&q=80' },
    quoteText: { type: String, default: '"We believe that a masterpiece cannot be rushed. It is built thread by thread, imbued with the life and soul of the artisan who weaves it."' },
    stat1Num: { type: String, default: '300+' },
    stat1Label: { type: String, default: 'Artisan Weavers' },
    stat2Num: { type: String, default: '100%' },
    stat2Label: { type: String, default: 'GI-Certified Purity' },
    stat3Num: { type: String, default: '1952' },
    stat3Label: { type: String, default: 'Year Established' },
  }
}, { timestamps: true });

// Always ensure there is only one settings document
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
