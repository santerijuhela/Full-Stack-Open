import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import { initializeUser } from './reducers/loginReducer'
import { initializeBlogs } from './reducers/blogReducer'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import UserHeader from './components/UserHeader'
import { Routes, Route } from 'react-router'
import { initializeUsers } from './reducers/userReducer'
import UserList from './components/UserList'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.currentUser)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

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
      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  )
}

export default App
