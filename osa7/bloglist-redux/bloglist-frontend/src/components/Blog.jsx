import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addLike, deleteBlog, removeBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [allVisible, setAllVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showWhenVisible = { display: allVisible ? '' : 'none' }
  const showForUser = {
    display:
      user.name === blog.user.name && user.username === blog.user.username
        ? ''
        : 'none',
  }

  const toggleVisibility = () => {
    setAllVisible(!allVisible)
  }

  const handleLike = async (blog) => {
    try {
      const returnedBlog = await dispatch(addLike(blog))
      dispatch(setNotificationWithTimeout(`Liked blog ${returnedBlog.title}`))
    } catch {
      dispatch(setNotificationWithTimeout('Blog not found', true))
      dispatch(removeBlog(blog))
    }
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        dispatch(deleteBlog(blog))
        dispatch(setNotificationWithTimeout(`Removed ${blog.title}`))
      } catch {
        dispatch(
          setNotificationWithTimeout(`Removing ${blog.title} failed`, true)
        )
      }
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>
          {allVisible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={showForUser}>
          <button onClick={() => handleRemove(blog)}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
