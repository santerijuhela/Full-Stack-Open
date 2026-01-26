import { useEffect, useContext } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import UserContext from './UserContext'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import UserHeader from './components/UserHeader'

const App = () => {
  const { user, userDispatch } = useContext(UserContext)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET', payload: user })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

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
      <UserHeader />
      <BlogList />
    </div>
  )
}

export default App
