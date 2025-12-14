import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const [nama,setNama] = useState("")
  useEffect(()=> {
    const token = localStorage.getItem("token")
    const savedNama = localStorage.getItem("name")
    if(!token) {
      navigate('/login')
    }else {
      setNama(savedNama)
    }
  },[])
  return (
    <>
      <div>
        <h1 className='text-indigo-600'>HELLO, {nama}</h1>
      </div>
    </>
  )
}

export default App
