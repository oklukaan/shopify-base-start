

const fs = require('fs');
const path = require('path');

console.log('📦 Shopify Base CSS Kuruluyor...');

// 1. Mevcut dizini kontrol et
const currentDir = process.cwd();
const assetsPath = path.join(currentDir, 'assets');

// 2. assets klasörü var mı? (Shopify teması mı?)
if (!fs.existsSync(assetsPath)) {
  console.error('❌ assets/ klasörü bulunamadı! Shopify teması klasöründe misin?');
  process.exit(1);
}

// 3. CSS dosyasını kopyala
const sourceCss = path.join(__dirname, 'test.css');
const targetCss = path.join(assetsPath, 'test.css');

try {
  fs.copyFileSync(sourceCss, targetCss);
  console.log('✅ base.css assets/ klasörüne eklendi');
} catch (error) {
  console.error('❌ CSS kopyalanırken hata:', error.message);
  process.exit(1);
}

// 4. theme.liquid'e otomatik ekleme (opsiyonel)
const themeLiquidPath = path.join(currentDir, 'layout/theme.liquid');
if (fs.existsSync(themeLiquidPath)) {
  const themeContent = fs.readFileSync(themeLiquidPath, 'utf8');
  
  if (!themeContent.includes('test.css')) {
    const newLink = '\n  {{ "test.css" | asset_url | stylesheet_tag }}';
    const updatedContent = themeContent.replace('</head>', newLink + '\n  </head>');
    
    fs.writeFileSync(themeLiquidPath, updatedContent);
    console.log('✅ theme.liquid güncellendi (test.css eklendi)');
  } else {
    console.log('ℹ️  test.css zaten theme.liquid\'de mevcut');
  }
}

console.log('🎉 Kurulum tamamlandı!');
