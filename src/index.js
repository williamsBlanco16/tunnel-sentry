const { tunnelSentry } = require('./app')
const { getEnv } = require('./utils/util.core.js')

const main = async () => {
  try {
    await getEnv()
    tunnelSentry()
  } catch (error) {
    throw new Error(`Error in main:${error.message}`)
  }
}

main().catch((err) => console.error(err.message))


