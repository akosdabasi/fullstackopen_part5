import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import PopUp from './components/PopUp';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchData = async () =>
  {
    try
    {
      let blogs = await blogService.getAll();
      blogs = blogs.map(blog => ({...blog, view: false}));
      setBlogs(blogs);
    }
    catch(err)
    {
      console.log(err);
    }
    
  }

  const createPopUp = (message, type, time) => 
  {
    setMessage(message);
    setMessageType(type);
    setTimeout(() => setMessage(null), time);
  };

  useEffect(() => 
  {
    fetchData();
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if(loggedUserJSON)
    {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.accessToken);
    }
  }, [])

  const createBlog = async (newBlog) => 
  {
    newBlog.author = user.name;
    try
    {
      const body = await blogService.create(newBlog);
      createPopUp(`${newBlog.title} by ${newBlog.author} has been created`, "info", 3000);
      setBlogs([...blogs, {...body, view: false}]);
    }
    catch(err)
    {
      createPopUp(err.response.data, 'error', 3000);
    }
  }

  const toggleDetailedView = (id) =>
  {
    const newBlogs = blogs.map(blog => blog.id === id ? ({...blog, view: !blog.view}) : blog);
    setBlogs(newBlogs);
  }

  const handleLike = async (blog) =>
  {
    try
    {
      const id = blog.id;
      await blogService.like(blog);
      const newBlogs = blogs.map(blog => blog.id === id ? ({...blog, likes: blog.likes + 1}) : blog);
      setBlogs(newBlogs);
    }
    catch(err)
    {
      createPopUp(err.response.data, 'error', 3000);
    }
  }

  const handleDelete = async (id) =>
  {
    try
    {
      const body = await blogService.remove(id);
      console.log(body);
      const newBlogs = blogs.filter(blog => blog.id !== id);
      setBlogs(newBlogs);
    }
    catch(err)
    {
      console.log(err);
      createPopUp(err.response.data, 'error', 3000);
    }
  }

  const handleLogout = () =>
  {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  }

  

  const renderLoggedIn = () => 
  <>
    <h1>{`Hello ${user.name}!`}</h1>
    <h2>create new blog:</h2>
    <Togglable buttonLabel="new blog">
      <BlogForm createBlog={createBlog}/>
    </Togglable>
    <button onClick={handleLogout}>Logout</button>
    <br />
    <h2><b>BLOGS</b></h2>
    <ul className='blogList'>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =><Blog key={blog.id} blog={blog} handleOnView={toggleDetailedView} handleLike={handleLike} handleDelete={handleDelete} deletable={user.username === blog.user.username}/>)}
    </ul>
  </>
  

  const renderLoggedOut = () =>
  <>
    <Togglable buttonLabel='sign in'>
      <LoginForm setUser={setUser} createPopUp={createPopUp}/>
    </Togglable>
  </>

  return (
    <div>
      <h1>Hello there!</h1>
      <PopUp message={message} className={messageType}/>
      {user === null ? renderLoggedOut() : renderLoggedIn()} 
    </div>
  )
}

export default App