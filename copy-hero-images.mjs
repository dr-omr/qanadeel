/**
 * 🖼️ Image Setup Script for Qandeel School Hero
 * 
 * Run this script to copy the uploaded hero images to the correct location.
 * 
 * Usage:
 *   node copy-hero-images.mjs
 * 
 * If the uploaded images aren't found automatically, you can manually:
 * 1. Save the first uploaded image (family walking from behind, closer view) as:
 *    public/images/hero-school-family-1.png
 * 
 * 2. Save the second uploaded image (wider shot with family) as:
 *    public/images/hero-school-family-2.png
 * 
 * The Hero component has a fallback mechanism that will use existing images
 * if the new ones aren't found, so the site will work either way.
 */

import { copyFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const publicImages = resolve('public', 'images');
const targets = [
  'hero-school-family-1.png',
  'hero-school-family-2.png',
];

// Check if targets already exist
const allExist = targets.every(t => existsSync(join(publicImages, t)));
if (allExist) {
  console.log('✅ Both hero images already exist. Nothing to do!');
  process.exit(0);
}

// Try common temp locations for uploaded images
const searchDirs = [
  'C:\\Users\\droma\\AppData\\Local\\Temp\\gc-images',
  'C:\\Users\\droma\\AppData\\Local\\Temp',
  'C:\\Users\\droma\\Downloads',
];

const fallbackSources = [
  { target: 'hero-school-family-1.png', source: 'school-exterior-hero-desktop.png' },
  { target: 'hero-school-family-2.png', source: 'kindergarten-hero.png' },
];

let found = false;

for (const dir of searchDirs) {
  if (!existsSync(dir)) continue;
  
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    if (files.length >= 2) {
      console.log(`Found images in: ${dir}`);
      console.log(`Files: ${files.join(', ')}`);
      
      // Try to copy the first two image files
      for (let i = 0; i < Math.min(2, files.length); i++) {
        const src = join(dir, files[i]);
        const dest = join(publicImages, targets[i]);
        if (!existsSync(dest)) {
          copyFileSync(src, dest);
          console.log(`✅ Copied ${files[i]} → ${targets[i]}`);
          found = true;
        }
      }
      if (found) break;
    }
  } catch {
    continue;
  }
}

if (!found) {
  console.log('⚠️  Could not find uploaded images automatically.');
  console.log('');
  console.log('Creating copies from existing images as fallback...');
  
  for (const { target, source } of fallbackSources) {
    const destPath = join(publicImages, target);
    const srcPath = join(publicImages, source);
    
    if (!existsSync(destPath) && existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`✅ Created ${target} from ${source}`);
    } else if (existsSync(destPath)) {
      console.log(`✅ ${target} already exists`);
    } else {
      console.log(`❌ Could not find source: ${source}`);
    }
  }
  
  console.log('');
  console.log('To use the new images, manually save them as:');
  console.log(`  ${join(publicImages, targets[0])}`);
  console.log(`  ${join(publicImages, targets[1])}`);
}

console.log('\n🎉 Done!');
