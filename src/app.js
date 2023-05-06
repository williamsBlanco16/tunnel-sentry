const express = require('express')
const cors = require('cors')
const { requiredEnvironment } = require('./utils/util.core')
const axios = require('axios').default

const tunnelSentry = () => {
  const app = express()
  const port = process.env.PORT || 3000

  const {
    SENTRY_HOST,
    PROJECT_IDS,
    CORS_ORIGIN
  } = requiredEnvironment()

  app.use(cors({
    origin: CORS_ORIGIN
  }))
  app.use(express.text({ type: 'text/plain' }))

  app.post('/sentry', async (req, res) => {
    debugger
    const envelope = req.body
    const piece = envelope.split('\n')
    const header = JSON.parse(piece[0])
    const dsn = new URL(header['dsn'])

    if (dsn.hostname !== SENTRY_HOST)
      return res.status(400).send('Invalid Sentry Host')

    const projectId = dsn.pathname.split('/')[1]
    if (!PROJECT_IDS.includes(projectId))
      return res.status(400).send('Invalid Project ID')

    const sentryDsn = `https://${SENTRY_HOST}/api/${projectId}/envelope/`
    const options = {
      method: 'POST',
      data: envelope,
      headers: { "Content-Type": "application/x-sentry-envelope" }
    }


    try {
      const response = await axios(sentryDsn, options)
      if (response.statusText === 'OK') {
        res.sendStatus(200)
      } else {
        res.sendStatus(500).send('Error forwarding event to Sentry')
      }
    } catch (err) {
      console.error('Error forwarding event to Sentry:', err)
      res.sendStatus(500).send('Error forwarding event to Sentry')
    }
  })

  app.get('/', (req, res) => {
    return res.sendStatus(200);
  });

  app.use((req, res) => {
    return res.status(404).send("Route not found")
  })

  app.listen(port, () => {
    console.log(`Server listening at ${port}`)
  })
}

module.exports = {
  tunnelSentry
}