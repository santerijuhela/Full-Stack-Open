import { useState } from 'react'

const useField = (name) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  const inputProps = { name, value, onChange }

  return {
    value,
    inputProps,
    reset
  }
}

export default useField