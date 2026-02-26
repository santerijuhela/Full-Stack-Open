import { useRef } from 'react'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { appendBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { Link } from 'react-router'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()

  const linkStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

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
          <div key={blog.id} style={linkStyle}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        ))}
    </div>
  )
}

export default BlogList
