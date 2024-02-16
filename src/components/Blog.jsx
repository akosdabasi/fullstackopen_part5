import './Blog.css'

const Blog = ({ blog, handleOnView, handleLike, handleDelete, deletable }) =>
{
  
  return blog.view ? 
  <div className="blogItem detailed">
    <span>
      {`${blog.title} by ${blog.author} `} 
      <button onClick={() => handleOnView(blog.id)}>hide</button>
      {deletable && <button className='deleteButton' onClick={() => handleDelete(blog.id)}>delete</button>}
    </span>
    <div>{blog.url}</div>
    <div>{blog.likes} <button onClick={() => handleLike(blog)}>like</button></div>
    <div>{`added by: ${blog.user.username}`}</div>
  </div>  
  :
  <div className="blogItem">
    <span>
      {`${blog.title} by ${blog.author} `} 
      <button onClick={() => handleOnView(blog.id)}>view</button>
      {deletable && <button className='deleteButton' onClick={() => handleDelete(blog.id)}>delete</button>}
    </span>
  </div>  
}
  
export default Blog