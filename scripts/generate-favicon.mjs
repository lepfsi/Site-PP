/**
 * Generates public/favicon.ico from src/app/icon.svg (sharp + ICO container).
 * ICO embeds PNG-compressed entries (supported by all modern browsers).
 *
 * Run: node scripts/generate-favicon.mjs
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const svgPath = path.join(root, "src", "app", "icon.svg");
const outPath = path.join(root, "public", "favicon.ico");

const SIZES = [16, 32, 48, 64];

const svg = await readFile(svgPath);

const pngs = [];
for (const size of SIZES) {
  const buffer = await sharp(svg, { density: 96 }).resize(size, size).png().toBuffer();
  pngs.push({ size, buffer });
}

function buildIco(images) {
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + images.length * entrySize;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  const data = [];
  for (const { size, buffer } of images) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(buffer.length, 8); // bytes in resource
    entry.writeUInt32LE(offset, 12); // image offset
    offset += buffer.length;
    entries.push(entry);
    data.push(buffer);
  }

  return Buffer.concat([header, ...entries, ...data]);
}

const ico = buildIco(pngs);
await writeFile(outPath, ico);

console.log(`✓ public/favicon.ico generated (${SIZES.join(", ")} px, ${ico.length} bytes)`);
