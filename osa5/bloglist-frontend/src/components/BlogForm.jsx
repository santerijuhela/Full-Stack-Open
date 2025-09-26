import { useState } from "react"

const BlogForm = ({ handleCreate }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = event => {
      event.preventDefault()
      const newBlog = {
        title,
        author,
        url
      }
      setTitle('')
      setAuthor('')
      setUrl('')
      handleCreate(newBlog)
    }

    return (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Author:
              <input
                type="text"
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              URL:
              <input
                type="text"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </label>
          </div>
          <button type="submit">create</button>
        </form>
    )
}

export default BlogForm