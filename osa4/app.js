const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const morgan = require('morgan')
const middleWare = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use('/api/blogs', blogsRouter)
app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app