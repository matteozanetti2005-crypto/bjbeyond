/**
 * Media pipeline. Turns the source art into the responsive WebP variants the
 * site serves. Re-run whenever the sources change:
 *
 *   node scripts/build-media.mjs
 *
 * The sources are bitmaps wrapped in SVG envelopes: the background alone is
 * 6.4MB of base64, uncompressible and unresizable, and it is a four-panel
 * contact sheet with reference labels burned in rather than a usable frame.
 * So: rasterise, split, strip the labels, emit real files at real widths.
 *
 * Static export forces `images.unoptimized`, so this replaces Next's on-demand
 * image optimisation entirely.
 */

import sharp from 'sharp';
import { mkdirSync, existsSync, statSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'media-src');
const OUT = join(ROOT, 'public', 'media');

mkdirSync(OUT, { recursive: true });

/** Quality tuned per role: atmosphere tolerates more compression than a face. */
const Q = { scene: 76, portrait: 86, mark: 92 };

/* The contact sheet: 7680x4352, a 2x2 grid of 3840x2176 panels. Panels 2-4
   carry a burned-in reference label along their top edge, cropped away by
   `labelStrip`. `INSET` trims the dark divider between panels. */
const SHEET = { w: 7680, h: 4352 };
const CELL = { w: SHEET.w / 2, h: SHEET.h / 2 };
const INSET = 16;

const PANELS = [
  {
    name: 'hero',
    col: 0,
    row: 0,
    labelStrip: 0, // top-left panel is unlabelled
    widths: [768, 1280, 1920, 2560],
    quality: Q.scene,
  },
  {
    name: 'backdrop',
    col: 1,
    row: 0,
    labelStrip: 210,
    widths: [768, 1280, 1920],
    quality: Q.scene,
  },
  {
    name: 'terrace',
    col: 0,
    row: 1,
    labelStrip: 210,
    widths: [640, 1024, 1600],
    quality: Q.scene,
  },
  {
    name: 'nocturne',
    col: 1,
    row: 1,
    labelStrip: 210,
    widths: [640, 1024, 1600],
    quality: Q.scene,
  },
];

/**
 * Pulls the embedded bitmap straight out of an SVG envelope.
 *
 * Rasterising the wrapper is the obvious move and is wrong here: the renderer
 * applies the SVG's own viewBox placement, which reframes the contact sheet and
 * produces crops that miss the panel grid. The embedded JPEG is authoritative.
 */
function embeddedRaster(svgPath) {
  const svg = readFileSync(svgPath, 'utf8');
  const match = /data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/=\s]+)/.exec(svg);
  if (!match) return null;
  return Buffer.from(match[2].replace(/\s/g, ''), 'base64');
}

async function buildPanels() {
  const source = join(SRC, 'background.svg');
  if (!existsSync(source)) {
    console.warn('skip panels — media-src/background.svg not found');
    return;
  }

  const full = embeddedRaster(source);
  if (!full) {
    console.warn('skip panels — no embedded raster in background.svg');
    return;
  }

  for (const panel of PANELS) {
    const left = panel.col * CELL.w + INSET;
    const top = panel.row * CELL.h + INSET + panel.labelStrip;
    const width = CELL.w - INSET * 2;
    const height = CELL.h - INSET * 2 - panel.labelStrip;

    const cropped = await sharp(full)
      .extract({ left, top, width, height })
      .toBuffer();

    for (const w of panel.widths) {
      const file = join(OUT, `${panel.name}-${w}.webp`);
      await sharp(cropped)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: panel.quality, effort: 6 })
        .toFile(file);
      report(file);
    }
  }
}

/* WebP because the cut-out needs the alpha channel; a JPEG could not carry it. */
async function buildPortrait() {
  const source = join(SRC, 'avatar.svg');
  if (!existsSync(source)) {
    console.warn('skip portrait — media-src/avatar.svg not found');
    return;
  }

  /* This one IS rasterised from the wrapper, unlike the panels: the envelope
     holds an RGB layer plus a greyscale alpha mask, and only the renderer
     composites them. Lifting the raw layers would lose the transparency. */
  const full = await sharp(source, { density: 150, limitInputPixels: false })
    .png()
    .toBuffer();

  /* Ceiling is 1080, not 1440. The envelope scales its 6144x4096 bitmap by
     0.807 into an 810x1440 viewBox, so the visible figure carries ~1003x1784
     real pixels. A 1440-wide variant would be a 1.44x upsample declared in the
     `srcset` as genuine detail — the browser would pick the heaviest file to
     get nothing, which is what made the portrait look soft before. */
  for (const w of [540, 810, 1080]) {
    const file = join(OUT, `portrait-${w}.webp`);
    await sharp(full)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: Q.portrait, effort: 6, alphaQuality: 100 })
      .toFile(file);
    report(file);
  }
}

/* Trimmed to its own bounds, so the component controls the padding rather than
   inheriting whatever margin the export happened to carry. */
async function buildLogo() {
  const source = join(SRC, 'logo.svg');
  if (!existsSync(source)) {
    console.warn('skip logo — media-src/logo.svg not found');
    return;
  }

  /* `density` multiplies the SVG's declared size: at 600 this 2000pt artboard
     rasterises to ~16000px square before the trim starts, which takes minutes.
     150 is already far above the 512px the largest variant needs. */
  const trimmed = await sharp(source, { density: 150, limitInputPixels: false })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  console.log(`  logo intrinsic ratio ${meta.width}x${meta.height}`);

  for (const w of [128, 256, 512]) {
    const file = join(OUT, `logo-${w}.webp`);
    await sharp(trimmed)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: Q.mark, effort: 6, alphaQuality: 100 })
      .toFile(file);
    report(file);
  }

  // PNG fallback.
  const png = join(OUT, 'logo.png');
  await sharp(trimmed).resize({ width: 512 }).png({ compressionLevel: 9 }).toFile(png);
  report(png);
}

/* Two assets, not interchangeable: `authentia.svg` is the wordmark alone (one
   line, aspect 5.26, used small in the footer credit); `authentia-lockup.png`
   is the full lockup with "Arte ©" beneath (aspect 3.43, used large as the
   section heading). Using the wordmark as the heading drops half the name. */
async function buildAuthentiaMark(sourceName, outName, widths) {
  const source = join(SRC, sourceName);
  if (!existsSync(source)) {
    console.warn(`skip ${outName} — media-src/${sourceName} not found`);
    return;
  }

  const trimmed = await sharp(source, { density: 150, limitInputPixels: false })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  console.log(
    `  ${outName} intrinsic ${meta.width}x${meta.height} (ratio ${(meta.width / meta.height).toFixed(2)})`,
  );

  for (const w of widths) {
    const file = join(OUT, `${outName}-${w}.webp`);
    await sharp(trimmed)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: Q.mark, effort: 6, alphaQuality: 100 })
      .toFile(file);
    report(file);
  }
}

/* Emitted into `app/`, where Next's metadata file conventions pick them up.
   The mark is white with transparency, so it is composited onto the site's
   near-black: left transparent it vanishes against light browser chrome. */
async function buildFavicons() {
  const source = join(SRC, 'logo.svg');
  if (!existsSync(source)) {
    console.warn('skip favicons — media-src/logo.svg not found');
    return;
  }

  const mark = await sharp(source, { density: 150, limitInputPixels: false })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  const variants = [
    { file: join(ROOT, 'app', 'icon.png'), size: 512, padding: 0.18 },
    /* iOS crops to a rounded square, so this one needs more inset. */
    { file: join(ROOT, 'app', 'apple-icon.png'), size: 180, padding: 0.22 },
  ];

  for (const { file, size, padding } of variants) {
    const inner = Math.round(size * (1 - padding * 2));
    const resized = await sharp(mark)
      .resize({ width: inner, height: inner, fit: 'inside' })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 10, g: 10, b: 11, alpha: 1 },
      },
    })
      .composite([{ input: resized, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(file);
    report(file);
  }
}

/* Social share card, emitted as app/opengraph-image.png where Next's metadata
   file convention picks it up and writes og:image + twitter:image itself.

   1200x630 because `summary_large_image` is 2:1 and that is the size every
   platform crops from. SVG is not an option — X, LinkedIn and WhatsApp do not
   render it in a card.

   The type is drawn by librsvg against system fonts, so it is NOT Inter unless
   Inter is installed locally; the stack falls back to a light grotesque that
   reads the same at feed size. This is safe only because the card is generated
   here and committed — the CI never runs this script, so the output cannot
   change under it. */
const CARD = { w: 1200, h: 630 };
const TYPE_STACK = 'Inter, Segoe UI Light, Helvetica Neue, sans-serif';
const MONO_STACK = 'JetBrains Mono, Consolas, monospace';

async function buildSocialCard() {
  const source = join(SRC, 'background.svg');
  const logoSource = join(SRC, 'logo.svg');
  if (!existsSync(source) || !existsSync(logoSource)) {
    console.warn('skip social card — media-src/background.svg or logo.svg not found');
    return;
  }

  const full = embeddedRaster(source);
  if (!full) {
    console.warn('skip social card — no embedded raster in background.svg');
    return;
  }

  /* The hero panel, same crop buildPanels takes, covered into 2:1. */
  const panel = await sharp(full)
    .extract({
      left: INSET,
      top: INSET,
      width: CELL.w - INSET * 2,
      height: CELL.h - INSET * 2,
    })
    .toBuffer();

  const plate = await sharp(panel)
    .resize({ width: CARD.w, height: CARD.h, fit: 'cover', position: 'centre' })
    .toBuffer();

  /* Two scrims: darker to the left and along the bottom, which is where the
     type sits. Without them the headline loses contrast over the sky. */
  const scrim = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.w}" height="${CARD.h}">
    <defs>
      <linearGradient id="h" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#050505" stop-opacity="0.93"/>
        <stop offset="58%" stop-color="#050505" stop-opacity="0.46"/>
        <stop offset="100%" stop-color="#050505" stop-opacity="0.28"/>
      </linearGradient>
      <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#050505" stop-opacity="0.42"/>
        <stop offset="42%" stop-color="#050505" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#050505" stop-opacity="0.78"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#h)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`);

  const mark = await sharp(logoSource, { density: 150, limitInputPixels: false })
    .trim({ threshold: 1 })
    .resize({ height: 68 })
    .png()
    .toBuffer();

  const type = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.w}" height="${CARD.h}">
    <text x="64" y="336" fill="#e8c547" font-family="${MONO_STACK}" font-size="17" font-weight="500" letter-spacing="3.4">ART MARKET INTELLIGENCE</text>
    <text x="64" y="416" fill="#f4f3f0" font-family="${TYPE_STACK}" font-size="78" font-weight="200" letter-spacing="-2">INTELLIGENCE</text>
    <text x="64" y="494" fill="#f4f3f0" font-family="${TYPE_STACK}" font-size="78" font-weight="200" letter-spacing="-2">IS THE STANDARD.</text>
    <rect x="64" y="528" width="56" height="1" fill="#e8c547"/>
    <text x="64" y="566" fill="#9c9b98" font-family="${MONO_STACK}" font-size="17" font-weight="500" letter-spacing="3.4">BJBEYOND.IT</text>
  </svg>`);

  /* JPEG, not PNG: the card is a photograph, and PNG quadruples the bytes a
     crawler has to fetch before it will render a preview. */
  const file = join(ROOT, 'app', 'opengraph-image.jpg');
  await sharp(plate)
    .composite([{ input: scrim }, { input: mark, left: 64, top: 58 }, { input: type }])
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(file);
  report(file);
}

function report(file) {
  const { size } = statSync(file);
  console.log(`  ${file.split(/[\\/]/).pop().padEnd(28)} ${(size / 1024).toFixed(0)} KB`);
}

console.log('building media…');
await buildPanels();
await buildPortrait();
await buildLogo();
await buildAuthentiaMark('authentia.svg', 'authentia', [256, 512]);
await buildAuthentiaMark('authentia-lockup.png', 'authentia-lockup', [320, 640, 960]);
await buildFavicons();
await buildSocialCard();
console.log('done');
