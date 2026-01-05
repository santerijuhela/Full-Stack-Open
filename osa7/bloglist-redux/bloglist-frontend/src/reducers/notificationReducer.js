import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      if (state.id === action.payload) {
        return null
      }
    },
  },
})

const { setNotification, clearNotification } = notificationSlice.actions

let notificationId = 0

export const setNotificationWithTimeout = (message, isError, seconds = 5) => {
  return (dispatch) => {
    const id = notificationId++
    dispatch(setNotification({ id, message, isError }))
    setTimeout(() => {
      dispatch(clearNotification(id))
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
