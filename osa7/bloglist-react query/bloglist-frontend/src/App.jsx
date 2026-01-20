import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useNotify } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const notify = useNotify()

  const blogFormRef = useRef()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogList = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogList.concat(newBlog))
      showNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`)
    },
  })

  const likeMutation = useMutation({
    mutationFn: ({ id, changedBlog }) => blogService.update(id, changedBlog),
    onSuccess: (updatedBlog) => {
      const blogList = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogList.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      )
      showNotification(`Liked blog ${updatedBlog.title}`)
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(error.response.data.error, true)
    },
  })

  const removeMutation = useMutation({
    mutationFn: ({ id }) => blogService.remove(id),
    onSuccess: (data, blogToRemove) => {
      const blogList = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogList.filter((blog) => blog.id !== blogToRemove.id)
      )
      showNotification(`Removed ${blogToRemove.title}`)
    },
    onError: (error, blogToRemove) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(
        `Removing ${blogToRemove.title} failed: ${error.response.data.error}`,
        true
      )
    },
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  const blogs = result.data

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('Wrong credentials', true)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    showNotification(`${user.name} logged out`)
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(newBlog)
  }

  const likeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    const changedBlog = { ...blog, user: blog.user.id, likes: blog.likes + 1 }
    likeMutation.mutate({ id, changedBlog })
  }

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find((blog) => blog.id === id)
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
      )
    ) {
      removeMutation.mutate(blogToRemove)
    }
  }

  const showNotification = (message, isError = false) => {
    notify({ message, isError })
  }

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
            addLike={() => likeBlog(blog.id)}
            remove={() => removeBlog(blog.id)}
          />
        ))}
    </div>
  )
}

export default App
