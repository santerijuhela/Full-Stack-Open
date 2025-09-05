const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { blogs, blogsInDb, nonExistingId, usersInDb } = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

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

  test('correct number of blogs is returned', async () => {
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

  describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const newData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 30
      }

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const expectedBlog = {
        ...blogToUpdate,
        likes: 30
      }
      const blogsAtEnd = await blogsInDb()

      assert.deepStrictEqual(updatedBlog.body, expectedBlog)
      assert.strictEqual(blogsAtEnd.length, blogs.length)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidID = '6a3d5da59270081a42a3445'
      const blogsAtStart = await blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const newData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 30
      }

      await api
        .put(`/api/blogs/${invalidID}`)
        .send(newData)
        .expect(400)

      const blogsAtEnd = await blogsInDb()
      const unchangedBlog = blogsAtEnd[0]

      assert.deepStrictEqual(unchangedBlog, blogToUpdate)
      assert.strictEqual(blogsAtEnd.length, blogs.length)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const blogsAtStart = await blogsInDb()
      const validNonexistingId = await nonExistingId()

      const newData = {
        ...blogsAtStart[0],
        likes: 30
      }

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(newData)
        .expect(404)

      const blogsAtEnd = await blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogs.length)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('whatever', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'annadm',
      name: 'Anne Administrator',
      password: 'topsecret'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})