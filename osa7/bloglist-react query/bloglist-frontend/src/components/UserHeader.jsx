import { useContext } from 'react'
import UserContext from '../UserContext'
import { useNotify } from '../NotificationContext'
import blogService from '../services/blogs'

const UserHeader = () => {
  const { user, userDispatch } = useContext(UserContext)
  const notify = useNotify()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    notify({ message: `${user.name} logged out` })
    blogService.setToken(null)
    userDispatch({ type: 'LOGOUT' })
  }

  return (
    <p>
      {user.name} logged in
      <button onClick={handleLogout}>Logout</button>
    </p>
  )
}

export default UserHeader
