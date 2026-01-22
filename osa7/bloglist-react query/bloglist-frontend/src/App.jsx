import { useEffect, useContext } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import { useNotify } from './NotificationContext'
import UserContext from './UserContext'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'

const App = () => {
  const { user, userDispatch } = useContext(UserContext)

  const notify = useNotify()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    showNotification(`${user.name} logged out`)
    blogService.setToken(null)
    userDispatch({ type: 'LOGOUT' })
  }

  const showNotification = (message, isError = false) => {
    notify({ message, isError })
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
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
      <BlogList />
    </div>
  )
}

export default App
