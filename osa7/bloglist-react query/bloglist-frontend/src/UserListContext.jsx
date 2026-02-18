import { createContext, useReducer } from 'react'

const userListReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    default:
      return state
  }
}

const UserListContext = createContext()

export const UserListContextProvider = (props) => {
  const [userList, userListDispatch] = useReducer(userListReducer, [])

  return (
    <UserListContext.Provider value={{ userList, userListDispatch }}>
      {props.children}
    </UserListContext.Provider>
  )
}

export default UserListContext
