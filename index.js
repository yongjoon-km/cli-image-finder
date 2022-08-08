import fs from 'fs';
import { PNG } from 'pngjs/browser.js';

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
