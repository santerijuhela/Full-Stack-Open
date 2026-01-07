import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      if (state.id === action.payload.id) {
        return null
      } else {
        return state
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

let notificationID = 0
export const useNotify = () => {
  const { notificationDispatch } = useContext(NotificationContext)
  return (payload) => {
    const id = notificationID++
    notificationDispatch({ type: 'SET', payload: { ...payload, id } })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR', payload: { id } })
    }, 5000)
  }
}

export default NotificationContext
