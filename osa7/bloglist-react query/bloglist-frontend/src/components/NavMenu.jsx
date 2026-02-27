import { useContext } from 'react'
import { Link, useNavigate } from 'react-router'
import UserContext from '../UserContext'
import { useNotify } from '../NotificationContext'

const NavMenu = () => {
  const { user, userDispatch } = useContext(UserContext)
  const notify = useNotify()
  const navigate = useNavigate()

  const padding = {
    padding: 5,
  }

  const handleLogout = () => {
    userDispatch({ type: 'LOGOUT' })
    notify({ message: `${user.name} logged out` })
    navigate('/')
  }

  return (
    <div>
      <Link style={padding} to={'/'}>
        blogs
      </Link>
      <Link style={padding} to={'/users'}>
        users
      </Link>
      <span style={padding}>{user.name} logged in</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default NavMenu
