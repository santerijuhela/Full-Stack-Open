import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { logoutUser } from '../reducers/loginReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const NavMenu = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.currentUser)

  const padding = {
    padding: 5,
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(setNotificationWithTimeout(`${user.name} logged out`))
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
