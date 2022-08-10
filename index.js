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
  for (const file of files) {
    const filePath = `${dir}/${file}`
    if (fs.statSync(filePath).isDirectory()) {
      findPngFile(filePath)
    } else if(filePath.endsWith('.png')) {
      console.log('found', filePath)
    }
  }
}

findPngFile(process.env.PWD)
