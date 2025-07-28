import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  return (
    <div className='h-screen w-screen bg-black'>
      <div className='bg-pink-600/35 h-56 w-56 absolute top-0 left-0 right-0 -translate-y-44 -translate-x-1/3 mx-auto rounded-full blur-3xl'></div>
      <div className='bg-teal-600/35 h-56 w-56 absolute top-0 left-0 right-0 -translate-y-44 translate-x-1/3 mx-auto rounded-full blur-3xl'></div>
      <span className='text-base text-white px-4 py-2 block text-center'>ChatFlow</span>
      <hr className='border-stone-800' />
      <div className='flex flex-row h-full'>
        <div className='w-full h-full'>
          
        </div>
        <div className='border-l border-stone-800 h-full w-96'></div>
      </div>
    </div>
  )
}

export default App
