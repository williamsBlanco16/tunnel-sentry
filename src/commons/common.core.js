const { access, constants } = require('fs')

const isFileExist = (path) => {
  return new Promise((resolve, reject) => {
    access(path, constants.F_OK, (err) => {
      if (err) reject(err)
      else resolve(true)
    })
  })
}

module.exports = {
  isFileExist
}