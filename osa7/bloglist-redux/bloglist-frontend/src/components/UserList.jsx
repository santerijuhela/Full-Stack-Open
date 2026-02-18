import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const UserList = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td>&nbsp;</td>
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
