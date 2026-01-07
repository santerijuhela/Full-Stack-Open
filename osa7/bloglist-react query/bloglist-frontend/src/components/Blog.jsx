import { useState } from 'react'

const Blog = ({ blog, addLike, user, remove }) => {
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
          <button onClick={addLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={showForUser}>
          <button onClick={remove}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
