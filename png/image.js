export function loadPNGImage(imagePath) {
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

export function findPngFile(dir) {
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
