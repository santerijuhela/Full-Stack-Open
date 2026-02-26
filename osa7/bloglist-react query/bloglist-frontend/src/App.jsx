import { useEffect, useContext } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'
import UserContext from './UserContext'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import UserHeader from './components/UserHeader'
import { Routes, Route, useMatch } from 'react-router'
import UserList from './components/UserList'
import BlogsForUser from './components/BlogsForUser'
import { useQuery } from '@tanstack/react-query'
import userListService from './services/users'
import Blog from './components/Blog'

const App = () => {
  const { user, userDispatch } = useContext(UserContext)
  const userResult = useQuery({
    queryKey: ['users'],
    queryFn: userListService.getAll,
  })

  const blogResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const userList = userResult.data
  const blogs = blogResult.data

  const userMatch = useMatch('/users/:id')
  const selectedUser = userMatch
    ? userList.find((u) => u.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const selectedBlog =
    blogMatch && blogs
      ? blogs.find((blog) => blog.id === blogMatch.params.id)
      : null

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
