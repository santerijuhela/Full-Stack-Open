import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { setNotificationWithTimeout } from './reducers/notificationReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'
import {
  initializeBlogs,
  appendBlog,
  addLike,
  deleteBlog,
} from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
      showNotification(`${user.name} logged in`)
    } catch {
      showNotification('Wrong credentials', true)
    }
  }

  const handleLogout = () => {
    showNotification(`${user.name} logged out`)
    dispatch(logoutUser())
  }

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    const createdBlog = await dispatch(appendBlog(newBlog))
    showNotification(
      `a new blog ${createdBlog.title} by ${createdBlog.author} added`
    )
  }

  const likeBlog = async (blog) => {
    try {
      const returnedBlog = await dispatch(addLike(blog))
      showNotification(`Added like to blog ${returnedBlog.title}`)
    } catch {
      showNotification('Blog not found', true)
      dispatch(removeBlog(blog))
    }
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(deleteBlog(blog))
        showNotification(`Removed ${blog.title}`)
      } catch {
        showNotification(`Removing ${blog.title} failed`, true)
      }
    }
  }

  const showNotification = (message, isError = false) => {
    dispatch(setNotificationWithTimeout(message, isError))
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <h2>create new</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleCreate={createBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            addLike={() => likeBlog(blog)}
            remove={() => removeBlog(blog)}
          />
        ))}
    </div>
  )
}

export default App
