import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'
import UserContext from '../UserContext'

const Blog = ({ blog }) => {
  const [allVisible, setAllVisible] = useState(false)

  const { user } = useContext(UserContext)
  const queryClient = useQueryClient()
  const notify = useNotify()

  const likeMutation = useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: (updatedBlog) => {
      const blogList = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogList.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      )
      notify({ message: `Liked blog ${updatedBlog.title}` })
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify({ message: error.response.data.error, isError: true })
    },
  })

  const removeMutation = useMutation({
    mutationFn: ({ id }) => blogService.remove(id),
    onSuccess: (data, blogToRemove) => {
      const blogList = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogList.filter((blog) => blog.id !== blogToRemove.id)
      )
      notify({ message: `Removed ${blogToRemove.title}` })
    },
    onError: (error, blogToRemove) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify({
        message: `Removing ${blogToRemove.title} failed: ${error.response.data.error}`,
        isError: true,
      })
    },
  })

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

  const likeBlog = (blog) => {
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    likeMutation.mutate({ id: blog.id, blog: changedBlog })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeMutation.mutate(blog)
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
          <button onClick={() => likeBlog(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={showForUser}>
          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
