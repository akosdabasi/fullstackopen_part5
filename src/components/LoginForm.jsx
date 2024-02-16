import { useState } from "react";
import loginService from '../services/login';
import blogService from '../services/blogs';


const LoginForm = (props) =>
{

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const {setUser, createPopUp} = props;
  const handleLogin = async (event) => 
  {
    event.preventDefault();
    
    try 
    {
      const user = await loginService.login({username, password});
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user)); 
      blogService.setToken(user.accessToken);
      setUser(user);
      setUsername('');
      setPassword('');
    } 
    catch (err) 
    {
      createPopUp(err.response.data, 'error', 3000);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
} 

export default LoginForm;