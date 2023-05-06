const { join } = require('path')
const dotenv = require('dotenv')
const { isFileExist } = require('../commons/common.core')

const getEnv = async () => {
  if (process.env.DOCKER_ENV) return
  const envPath = join(__dirname, '..', '..', 'env-config', `.env.${process.env.NODE_ENV}`)
  //check if .env file exist
  try {
    await isFileExist(envPath)
    dotenv.config({
      path: envPath
    })
  } catch (err) {
    throw new Error(`Error in getEnv: ${err.message}`)
  }
}

const requiredEnvironment = () => {
  const SENTRY_HOST = process.env.SENTRY_HOST
  const PROJECT_IDS = process.env.PROJECT_IDS.split(',')
  const CORS_ORIGIN = process.env.CORS_ORIGIN

  if (!SENTRY_HOST || !PROJECT_IDS || !CORS_ORIGIN) {
    console.error('Missing required environment variables')
    process.exit(1)
  }
  return {
    SENTRY_HOST,
    PROJECT_IDS,
    CORS_ORIGIN
  }
}

module.exports = {
  getEnv,
  requiredEnvironment
}