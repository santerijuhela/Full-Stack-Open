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

test('returned blogs have the field id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(Object.hasOwn(blog, 'id'))
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test adding blog',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2025/09/04/TestBlog.html',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes('Test adding blog'))
})

test('a blog with no likes set has likes set to zero', async () => {
  const newBlog = {
    title: 'Testing no likes',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2025/09/04/NoLikes.html'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await blogsInDb()
  const addedBlog = blogsAtEnd.find(blog => blog.title === 'Testing no likes')
  assert.strictEqual(addedBlog.likes, 0)
})

test('a blog with no title is not added', async () => {
  const newBlog = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2025/09/04/NoTitle.html',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogs.length)
})

test('a blog with no url is not added', async () => {
  const newBlog = {
    title: 'Testing no url',
    author: 'Robert C. Martin',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogs.length)
})

after(async () => {
  await mongoose.connection.close()
})