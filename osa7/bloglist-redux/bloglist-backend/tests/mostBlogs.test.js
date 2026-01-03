const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { listWithOneBlog, blogs } = require("./test_helper");

describe("most blogs", () => {
  test("when list is empty equals null", () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), null);
  });

  test("when list has only one blog equals the author of that blog and one blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    const expected = {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    };
    assert.deepStrictEqual(result, expected);
  });

  test("when list has several blogs equals the correct author and nunber of blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    const expected = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    assert.deepStrictEqual(result, expected);
  });
});
