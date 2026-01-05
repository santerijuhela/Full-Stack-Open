const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { listWithOneBlog, blogs } = require('./test_helper')

describe('most likes', () => {
  test('when list is empty equals null', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), null)
  })

  test('when list has only one blog equals the author and likes of that blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when list has several blogs equals the correct author and sum of likes', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    assert.deepStrictEqual(result, expected)
  })
})
