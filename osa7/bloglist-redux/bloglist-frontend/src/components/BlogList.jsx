import { useRef } from 'react'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import Blog from './Blog'
import { useDispatch, useSelector } from 'react-redux'
import { appendBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    const createdBlog = await dispatch(appendBlog(newBlog))
    dispatch(
      setNotificationWithTimeout(
        `A new blog ${createdBlog.title} by ${createdBlog.author} added`
      )
    )
  }

  return (
    <div>
      <h2>create new</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleCreate={createBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  )
}

export default BlogList
