#!/usr/bin/env node
import fs from 'fs';
import { PNG } from 'pngjs/browser.js';
import path from 'node:path';
import { program } from 'commander';

program
  .argument('<imagePathToLookUp>', 'image file path to find')

program.parse()

const originalImagePath = path.resolve(process.env.PWD, program.args[0]);

function loadPNGImage(imagePath) {
  return new Promise((res, rej) => {
    fs.createReadStream(imagePath)
      .on("error", function() {
        rej(this)
      })
      .pipe(
        new PNG({
          filterType: 4,
        })
      ).on("parsed", function() {
        res(this)
      })
  })
}

let originalImage
try {
  originalImage = await loadPNGImage(originalImagePath)
} catch (err) {
  console.log('file not found', originalImagePath)
  process.exit(-1);
}

function findPngFile(dir) {
  const files = fs.readdirSync(dir)
  let result = []
  for (const file of files) {
    const filePath = `${dir}/${file}`
    if (fs.statSync(filePath).isDirectory()) {
      result = result.concat(findPngFile(filePath))
    } else if (filePath.endsWith('.png')) {
      result.push(filePath)
    }
  }
  return result
}

const pngFiles = findPngFile(process.env.PWD).filter(filePath => filePath !== originalImagePath)

let matchFound = ""
for (const pngFile of pngFiles) {
  const targetImage = await loadPNGImage(pngFile)
  if (originalImage.width !== targetImage.width || originalImage.height !== targetImage.height) {
    continue
  }
  let diff = 0
  for (let i = 0; i < targetImage.data.length; i++) {
    diff += (targetImage.data[i] - originalImage.data[i]) ** 2
  }
  if (diff === 0) {
    matchFound = pngFile
  }
}

console.log('found', matchFound)
