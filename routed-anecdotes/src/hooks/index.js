import { useState } from 'react'

export const useField = (name) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    name,
    value,
    onChange,
    reset
  }
}

// moduulissa voi olla monta nimettyä eksportia

export const useAnotherHook = () => {
  // ...
}