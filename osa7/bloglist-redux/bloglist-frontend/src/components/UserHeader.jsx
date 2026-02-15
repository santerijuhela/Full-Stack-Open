import { useDispatch, useSelector } from 'react-redux'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { logoutUser } from '../reducers/loginReducer'

const UserHeader = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.currentUser)

  const handleLogout = () => {
    dispatch(setNotificationWithTimeout(`${user.name} logged out`))
    dispatch(logoutUser())
  }

  return (
    <p>
      {user.name} logged in <button onClick={handleLogout}>Logout</button>
    </p>
  )
}

export default UserHeader
