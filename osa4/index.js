const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')

const app = express()

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})