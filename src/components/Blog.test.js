import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: "Test blog",
    author: "Test Thomas",
    url: "https://test.com/",
    likes: 7,
    view: true,
    user: 
    {
      username: "akosdabasi",
    }
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText('Test blog by Test Thomas');
  screen.debug(element);
})