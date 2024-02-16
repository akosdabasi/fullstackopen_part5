import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test.only('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const {container} = render(<BlogForm createBlog={createBlog} />)

  const input_title = container.querySelector('#title-input')
  const input_url = container.querySelector('#url-input')
  const sendButton = screen.getByText('save')
  await user.type(input_title, 'testing a form...')
  await user.type(input_url, 'testing url')
  screen.debug(input_title);
  screen.debug(input_url);
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  console.log(createBlog.mock.calls);
  expect(createBlog.mock.calls[0][0]).toEqual({title: 'testing a form...', url: 'testing url'});
})