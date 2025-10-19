import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      title: 'Test blog',
      author: 'Anna Author',
      url: 'https://test.blog.net',
      user: {
        name: 'Taru Tester',
        username: 'testUser'
      },
      likes: 23
    }

    const user = {
      name: 'Taru Tester',
      username: 'testUser'
    }

    render(<Blog blog={blog} user={user} />)
  })

  test('at start displays title and author but not url or likes', () => {
    const element = screen.getByText('Test blog Anna Author')
    expect(element).toBeVisible()

    const urlElement = screen.getByText('https://test.blog.net')
    expect(urlElement).not.toBeVisible()

    const likeElement = screen.getByText('likes 23')
    expect(likeElement).not.toBeVisible()
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const testUser = userEvent.setup()
    const button = screen.getByText('view')
    await testUser.click(button)

    const urlElement = screen.getByText('https://test.blog.net')
    expect(urlElement).toBeVisible()

    const likeElement = screen.getByText('likes 23')
    expect(likeElement).toBeVisible()

    const userElement = screen.getByText('Taru Tester')
    expect(userElement).toBeVisible()
  })
})