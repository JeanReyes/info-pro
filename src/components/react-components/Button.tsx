import React from 'react'

export const ActionButton = () => {

  const handleClick = () => {
    console.log('Button clicked')
  }
  
  return (
    <button onClick={handleClick}>Click me</button>
  )
}
