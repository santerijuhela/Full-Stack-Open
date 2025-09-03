const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { blogs, blogsInDb } = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of notes is returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, blogs.length)
})

test('a blog with a specific title is among the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)
  assert(titles.includes('React patterns'))
})

after(async () => {
  await mongoose.connection.close()
})