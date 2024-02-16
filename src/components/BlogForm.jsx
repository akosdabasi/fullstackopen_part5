import { useState } from 'react';


const BlogForm = (props) => 
{
  const {createBlog} = props;
  const [newBlog, setNewBlog] = useState({});

  const addBlog = async (event) =>
  {
    event.preventDefault();
    createBlog({...newBlog});
    setNewBlog({title:'', url:''});

  }

  return (
  <form onSubmit={addBlog}>
    <div>
      title
      <input
        id='title-input'
        value={newBlog.title}
        onChange={({ target }) => setNewBlog({title: target.value, url: newBlog.url})}
      />
    </div>
    <div>
      url
      <input
        id='url-input'
        value={newBlog.url}
        onChange={({ target }) => setNewBlog({url: target.value, title: newBlog.title})}
      />
    </div>
    <button type="submit">save</button>
  </form>)
}

export default BlogForm;