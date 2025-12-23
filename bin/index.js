#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("📦 Shopify starter çalışıyor...");

/**
 * 1️⃣ assets içine CSS ekler
 */
function ensureAssetsCss(projectRoot, starterRoot) {
  const assetsDir = path.join(projectRoot, "assets");
  const sourceCss = path.join(starterRoot, "css", "test.css");
  const targetCss = path.join(assetsDir, "test.css");

  if (!fs.existsSync(assetsDir)) {
    console.error("❌ assets klasörü bulunamadı. Shopify tema içindesin mi?");
    process.exit(1);
  }

  if (fs.existsSync(targetCss)) {
    console.log("ℹ️ test.css zaten mevcut");
    return;
  }

  fs.copyFileSync(sourceCss, targetCss);
  console.log("✅ test.css assets klasörüne eklendi");
}

/**
 * 2️⃣ theme.liquid içine CSS link ekler
 */
function ensureThemeLiquidCss(projectRoot) {
  const themeLiquidPath = path.join(projectRoot, "layout", "theme.liquid");
  const cssTag = "{{ 'test.css' | asset_url | stylesheet_tag }}";

  if (!fs.existsSync(themeLiquidPath)) {
    console.warn("⚠️ theme.liquid bulunamadı, CSS link eklenmedi");
    return;
  }

  let content = fs.readFileSync(themeLiquidPath, "utf8");

  if (content.includes(cssTag)) {
    console.log("ℹ️ CSS zaten theme.liquid içinde mevcut");
    return;
  }

  if (!content.includes("</head>")) {
    console.warn("⚠️ </head> bulunamadı, CSS eklenemedi");
    return;
  }

  content = content.replace(
    "</head>",
    `  ${cssTag}\n</head>`
  );

  fs.writeFileSync(themeLiquidPath, content, "utf8");
  console.log("✅ CSS linki theme.liquid içine eklendi");
}

/**
 * 3️⃣ Tüm section'lara snippet ekler
 */
function injectSnippetIntoSections(projectRoot) {
  const sectionsDir = path.join(projectRoot, "sections");
  const snippetTag = "{% render 'my-snippet' %}";

  if (!fs.existsSync(sectionsDir)) {
    console.warn("⚠️ sections klasörü bulunamadı");
    return;
  }

  const sectionFiles = fs
    .readdirSync(sectionsDir)
    .filter(file => file.endsWith(".liquid"));

  sectionFiles.forEach(file => {
    const filePath = path.join(sectionsDir, file);
    let content = fs.readFileSync(filePath, "utf8");

    if (content.includes(snippetTag)) {
      console.log(`ℹ️ ${file} zaten snippet içeriyor`);
      return;
    }

    content = content.trimEnd() + "\n\n" + snippetTag + "\n";
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ${file} → snippet eklendi`);
  });
}

/**
 * 🚀 Runner
 */
function run() {
  const projectRoot = process.cwd();
  const starterRoot = path.resolve(__dirname, "..");

  ensureAssetsCss(projectRoot, starterRoot);
  ensureThemeLiquidCss(projectRoot);
  injectSnippetIntoSections(projectRoot);

  console.log("🎉 Shopify starter tamamlandı");
}

run();
