import { useQuery } from '@tanstack/react-query'
import userListService from '../services/users'
import { Link } from 'react-router'

const UserList = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: userListService.getAll,
  })

  if (result.isLoading) {
    return <div>Loading users...</div>
  }

  const users = result.data

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
