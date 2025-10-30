const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Filed to fetch anecdotes')
  }

  return response.json()
}

export default { getAll }