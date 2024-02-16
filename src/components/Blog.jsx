//import './Blog.css'

const Blog = ({ blog, handleOnView, handleLike, handleDelete, deletable }) =>
{
  
  return (
    <div className="blogItem">
      <span>
        {`${blog.title} by ${blog.author} `} 
        <button onClick={() => handleOnView(blog.id)}>{blog.view ? 'hide' : 'view'}</button>
        {deletable && <button className='deleteButton' onClick={() => handleDelete(blog.id)}>delete</button>}
      </span>
      {blog.view && 
        <>
        <div>{blog.url}</div>
        <div>{blog.likes} <button onClick={() => handleLike(blog)}>like</button></div>
        <div>{`added by: ${blog.user.username}`}</div>
        </>
      }
    </div>  
)}
  
export default Blog