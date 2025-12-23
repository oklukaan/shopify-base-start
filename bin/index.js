#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("📦 Shopify starter yükleniyor...");

// Shopify repo (çalıştırdığın yer)
const projectRoot = process.cwd();
const assetsDir = path.join(projectRoot, "assets");

if (!fs.existsSync(assetsDir)) {
  console.error("❌ assets klasörü bulunamadı. Shopify tema içindesin mi?");
  process.exit(1);
}

// Starter repo yolu (BU REPO)
const starterRoot = path.resolve(__dirname, "..");
const sourceCss = path.join(starterRoot, "css", "test.css");
const targetCss = path.join(assetsDir, "test.css");
const themeLiquidPath = path.join(projectRoot, "layout", "theme.liquid");
const cssTag = "{{ 'test.css' | asset_url | stylesheet_tag }}";

if (!fs.existsSync(themeLiquidPath)) {
  console.warn("⚠️ theme.liquid bulunamadı, CSS link eklenmedi");
  return;
}

let themeContent = fs.readFileSync(themeLiquidPath, "utf8");

// Zaten ekliyse tekrar ekleme
if (themeContent.includes(cssTag)) {
  console.log("ℹ️ CSS zaten theme.liquid içinde mevcut");
} else {
  if (themeContent.includes("</head>")) {
    themeContent = themeContent.replace(
      "</head>",
      `  ${cssTag}\n</head>`
    );

    fs.writeFileSync(themeLiquidPath, themeContent, "utf8");
    console.log("✅ CSS linki theme.liquid içine eklendi");
  } else {
    console.warn("⚠️ </head> bulunamadı, CSS eklenemedi");
  }
}
fs.copyFileSync(sourceCss, targetCss);

console.log("✅ test.css assets klasörüne eklendi");
