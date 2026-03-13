// import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addLike, deleteBlog, removeBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { Link, useNavigate } from 'react-router'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.currentUser)
  const navigate = useNavigate()

  //  const [allVisible, setAllVisible] = useState(false)

  if (!blog) {
    return null
  }

  //  const showWhenVisible = { display: allVisible ? '' : 'none' }
  const showForUser = {
    display:
      user.name === blog.user.name && user.username === blog.user.username
        ? ''
        : 'none',
  }

  /*
  const toggleVisibility = () => {
    setAllVisible(!allVisible)
  }
    */

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
        navigate('/')
      } catch {
        dispatch(
          setNotificationWithTimeout(`Removing ${blog.title} failed`, true)
        )
      }
    }
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      {/*}
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>
          {allVisible ? 'hide' : 'view'}
        </button>
      </div>
      */}
      <div /*style={showWhenVisible}*/>
        <Link to={blog.url}>{blog.url}</Link>
        <div>
          {blog.likes} likes
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>Added by {blog.user.name}</div>
        <div style={showForUser}>
          <button onClick={() => handleRemove(blog)}>remove</button>
        </div>
      </div>
      <h3>comments</h3>
      <div>
        <ul>
          {blog.comments.map((c) => (
            <li key={c.id}>{c.content}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog
