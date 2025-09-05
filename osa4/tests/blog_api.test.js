const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { blogs, blogsInDb, nonExistingId } = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
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

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToView = blogsAtStart[0]

      const viewedBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(viewedBlog.body, blogToView)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidID = '6a3d5da59270081a42a3445'

      await api
        .get(`/api/blogs/${invalidID}`)
        .expect(400)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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

    test('succeeds and sets likes to zero if likes not set', async () => {
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

    test('fails with status code 400 if no title', async () => {
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

    test('fails with status code 400 if no url', async () => {
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
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogs.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidID = '6a3d5da59270081a42a3445'

      await api.delete(`/api/blogs/${invalidID}`)
        .expect(400)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})