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

fs.copyFileSync(sourceCss, targetCss);

console.log("✅ test.css assets klasörüne eklendi");
