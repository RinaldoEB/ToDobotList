import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const [nama,setNama] = useState("")
  const [title,setTitle] = useState("")
  const [content,setContent] = useState("")
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

  const handleAddNote = async(e) => {
    e.preventDefault()
    const url = "http://localhost:3007/api/note";

    const body = {
      title : title.trim(),
      content : content.trim()
    }

    const response = await fetch(url, {
      method : "POST",
      headers : {
        Authorization : `Bearer ${token}`,
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(body)
    })

    const data = await response.json()
    if(!response.ok) {
      alert(data.message)
      return
    }
    if(!title.trim() || !content.trim()) {
      return alert("tidak boleh kosong")
    }
    
    
    setNote(prev => [...prev,data.data])
    setTitle("")
    setContent("")
    alert("data berhasil ditambah")
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
        <br />
        <h1 className='text-indigo-500'>Tambah Note</h1>
        <div className='addNote'>
          <form onSubmit={handleAddNote}>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder='add title' required/>
            <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder='add content' required/>
            <input type="submit" />
          </form>
        </div>
      </div>
    </>
  )
}

export default App
