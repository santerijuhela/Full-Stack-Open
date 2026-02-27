import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import { initializeUser } from './reducers/loginReducer'
import { initializeBlogs } from './reducers/blogReducer'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import { Routes, Route, useMatch } from 'react-router'
import { initializeUsers } from './reducers/userReducer'
import UserList from './components/UserList'
import BlogsForUser from './components/BlogsForUser'
import Blog from './components/Blog'
import NavMenu from './components/NavMenu'

const App = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.currentUser)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  const userMatch = useMatch('/users/:id')
  const selectedUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const selectedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  if (loggedUser === null) {
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
      <NavMenu />
      <h2>blogs</h2>
      <Notification />
      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route
          path="/users/:id"
          element={<BlogsForUser user={selectedUser} />}
        />
        <Route path="/blogs/:id" element={<Blog blog={selectedBlog} />} />
        <Route path="/" element={<BlogList />} />
      </Routes>
    </div>
  )
}

export default App
