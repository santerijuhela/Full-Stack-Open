import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    likeBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    removeBlog(state, action) {
      const blogToDelete = action.payload
      return state.filter((blog) => blog.id !== blogToDelete.id)
    },
  },
})

const { createBlog, setBlogs, likeBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const appendBlog = (newBlog) => {
  return async (dispatch) => {
    const blogToAdd = await blogService.create(newBlog)
    dispatch(createBlog(blogToAdd))
    return blogToAdd
  }
}

export const addLike = (blog) => {
  return async (dispatch) => {
    const changedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
    dispatch(likeBlog(changedBlog))
    return changedBlog
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id)
    dispatch(removeBlog(blog))
  }
}

export { removeBlog }
export default blogSlice.reducer
