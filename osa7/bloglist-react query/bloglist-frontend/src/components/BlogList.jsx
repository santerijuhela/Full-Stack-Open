import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router'

const BlogList = () => {
  const queryClient = useQueryClient()
  const blogFormRef = useRef()
  const notify = useNotify()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogList = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogList.concat(newBlog))
      notify({
        message: `A new blog ${newBlog.title} by ${newBlog.author} added`,
      })
    },
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  const blogs = result.data

  const linkStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const createBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(newBlog)
  }

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleCreate={createBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <div key={blog.id} style={linkStyle}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        ))}
    </div>
  )
}

export default BlogList
