import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

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

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: "Test blog",
    author: "Test Thomas",
    url: "https://test.com/",
    likes: 7,
    view: false,
    user: 
    {
      username: "akosdabasi",
    }
  };

  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} handleOnView={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})