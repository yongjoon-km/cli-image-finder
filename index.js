import fs from 'fs';
import { PNG } from 'pngjs/browser.js';
import path from 'node:path';

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

const image = await loadPNGImage('./sample/avocado.png')
console.log('data', image.data)
console.log(image.width, image.height)

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
    } else if(filePath.endsWith('.png')) {
      result.push(filePath)
    }
  }
  return result
}

const pngFiles = findPngFile(process.env.PWD)
console.log(pngFiles)
