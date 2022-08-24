#!/usr/bin/env node
import path from 'node:path';
import { program } from 'commander';
import { loadPNGImage, findPngFile } from './png/image.js'

program
  .argument('<imagePathToLookUp>', 'image file path to find')

program.parse()

const originalImagePath = path.resolve(process.env.PWD, program.args[0]);

let originalImage
try {
  originalImage = await loadPNGImage(originalImagePath)
} catch (err) {
  console.log(err)
  console.log('file not found', originalImagePath)
  process.exit(-1);
}

const sameImageFiles = findPngFile(process.env.PWD).filter(filePath => filePath !== originalImagePath)

for (const image of sameImageFiles) {
  const targetImage = await loadPNGImage(image)
  if (originalImage.width !== targetImage.width || originalImage.height !== targetImage.height) {
    continue
  }
  let diff = 0
  for (let i = 0; i < targetImage.data.length; i++) {
    diff += (targetImage.data[i] - originalImage.data[i]) ** 2
  }
  if (diff === 0) {
    console.log(image)
  }
}
