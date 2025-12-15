import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      showNotification("Wrong credentials", true);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogappUser");
    showNotification(`${user.name} logged out`);
    blogService.setToken(null);
    setUser(null);
  };

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    const returnedBlog = await blogService.create(newBlog);
    setBlogs(blogs.concat(returnedBlog));
    showNotification(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
    );
  };

  const likeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    const changedBlog = { ...blog, user: blog.user.id, likes: blog.likes + 1 };
    try {
      const returnedBlog = await blogService.update(id, changedBlog);
      setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)));
      showNotification(`Added like to blog ${returnedBlog.title}`);
    } catch {
      showNotification("Blog not found", true);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find((blog) => blog.id === id);
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`,
      )
    ) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        showNotification(`Removed ${blogToRemove.title}`);
      } catch {
        showNotification(`Removing ${blogToRemove.title} failed`, true);
      }
    }
  };

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification({ message: null });
    }, 5000);
  };

  const blogFormRef = useRef();

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <h2>create new</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleCreate={createBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => -a.likes + b.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            addLike={() => likeBlog(blog.id)}
            remove={() => removeBlog(blog.id)}
          />
        ))}
    </div>
  );
};

export default App;
