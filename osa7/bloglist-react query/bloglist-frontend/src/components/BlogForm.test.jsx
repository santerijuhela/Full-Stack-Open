import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls handleCreate with correct data', async () => {
  const user = userEvent.setup()
  const handleCreate = vi.fn()

  render(<BlogForm handleCreate={handleCreate} />)

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'testing title')
  await user.type(authorInput, 'Allan Author')
  await user.type(urlInput, 'https://blogform.test.net')
  await user.click(createButton)

  expect(handleCreate.mock.calls[0][0].title).toBe('testing title')
  expect(handleCreate.mock.calls[0][0].author).toBe('Allan Author')
  expect(handleCreate.mock.calls[0][0].url).toBe('https://blogform.test.net')
})
