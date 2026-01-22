import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'

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

  const createBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(newBlog)
  }

  return (
    <div>
      <h2>create new</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleCreate={createBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  )
}

export default BlogList
