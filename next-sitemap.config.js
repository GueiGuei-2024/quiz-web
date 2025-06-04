// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://taiwan-doctor-examination.netlify.app/',  // ← 改成你的正式網域
  generateRobotsTxt: true,          // 自動產生 robots.txt
  changefreq: 'weekly',              // 頁面更新頻率：daily/weekly
  priority: 0.7,                    // 頁面重要性（0~1）
  exclude: ['/analysis'], 
};