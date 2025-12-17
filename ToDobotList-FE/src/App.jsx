import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const [nama,setNama] = useState("")
  const [notes,setNote] = useState([])
  const token = localStorage.getItem("token")
  const savedNama = localStorage.getItem("name")

  const listNotes = async() => {
    const noteUrl = "http://localhost:3007/api/note"
    const response = await fetch(noteUrl,{  
      method : "GET",
      headers : {
        Authorization : `Bearer ${token}`,
        "Content-Type" : "application/json"
      },
    })
    const data = await response.json();
    setNote(data.data)

  }
  useEffect(()=> {  
    if(!token) {
      navigate('/login')
      return
    }else {
      setNama(savedNama)
      listNotes()
    } 
  },[])
  return (
    <>
      <div>
        <h1 className='text-indigo-600'>HELLO, {nama}</h1>
        <h2>List Note</h2>
        {notes.map(note => (
            <ul key={note.id}>
              <li>
                title : {note.title} <br />
                content : {note.content}
              </li>
            </ul>
        ))}
      </div>
    </>
  )
}

export default App
