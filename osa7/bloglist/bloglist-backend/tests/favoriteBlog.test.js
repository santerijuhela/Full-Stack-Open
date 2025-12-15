const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { listWithOneBlog, blogs } = require("./test_helper");

describe("favorite blog", () => {
  test("when list is empty equals null", () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null);
  });

  test("when list has only one blog equals that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, listWithOneBlog[0]);
  });

  test("when list has several blogs equals the correct blog", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, blogs[2]);
  });
});
