import fs from 'fs';
import { PNG } from 'pngjs/browser.js';
import path from 'node:path';

const originalImagePath = '/Users/yongjoon/repositories/cli-image-finder/sample/avocado.png'

function loadPNGImage(imagePath) {
  return new Promise((res, _) => {
    fs.createReadStream(imagePath)
      .pipe(
        new PNG({
          filterType: 4,
        })
      ).on("parsed", function() {
        res(this)
      })
  })
}

const originalImage = await loadPNGImage(originalImagePath)
console.log('data', originalImage.data)
console.log(originalImage.width, originalImage.height)

// iterate files
console.log("iterating files")
console.log(process.env.PWD)

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
console.log(pngFiles)

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
