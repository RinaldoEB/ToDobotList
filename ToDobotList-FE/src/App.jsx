import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const [nama,setNama] = useState("")
  const [title,setTitle] = useState("")
  const [content,setContent] = useState("")
  const [notes,setNote] = useState([])
  const [editButton, setEditButton] = useState(false)
  const [editNote,setEditNote] = useState({
    id : "",
    title : "",
    content : ""
  })
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
    
    if(!title.trim() || !content.trim()) {
      alert("tidak boleh kosong")
      return
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
    
    
    setNote(prev => [...prev,data.data])
    setTitle("")
    setContent("")
    alert("data berhasil ditambah")
  }

  const handleEditButton = async(note) => {
    setEditNote(note)
    setEditButton(true)
  }

  const handleEditNote = async () => {
    
    const editBody = {
      title : editNote.title.trim(),
      content : editNote.content.trim()
    }

    if(!editNote.title.trim() || !editNote.content.trim()) {
      alert("tidak ada content !")
      return
    }

    const url = `http://localhost:3007/api/note/${editNote.id}`
    const res = await fetch(url,{
      method : "PUT",
      headers : {
        Authorization : `Bearer ${token}`,
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(editBody)
    })

    const data = await res.json()
    if(!res.ok) {
      alert(data.message)
      return
    }
    alert("data change")
    setNote(prev => prev.map(s => (s.id === data.data.id ? data.data : s)))
    setEditButton(false)
  }

  const handleDeleteNote = async(id) => {
    const url = `http://localhost:3007/api/note/${id}`
    const res = await fetch(url, {
       method : "DELETE",
        headers : {
        Authorization : `Bearer ${token}`,
        "Content-Type" : "application/json"
      }
    })
    const data = await res.json()
    if(!res.ok) {
      alert(data.message)
    }

    alert("berhasil dihapus")
    setNote(prev => prev.filter(s => s.id !== id))

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
                content : {note.content} <br />
                <button className='border border-indigo-9' onClick={() => handleEditButton(note)}>Edit</button>
                <button className='border border-indigo-9' onClick={() => handleDeleteNote(note.id)}>delete</button>
                
              </li>
            </ul>
        ))}
        {editButton && (
          <div>
            <br />
            <h1 className='text-indigo-900'>Edit Data</h1>
            <input type="text" value={editNote.title} onChange={(e) => setEditNote({...editNote, title : e.target.value})} />
             <input type="text" value={editNote.content} onChange={(e) => setEditNote({...editNote, content : e.target.value})} />
             <br />
             <button onClick={handleEditNote}>submit</button>
             <br />
             <button onClick={() => setEditButton(false)}>cancel</button>
          </div>
        )}
        <br />
        <h1 className='text-indigo-500'>Tambah Note</h1>
        <div className='addNote'>
          <form onSubmit={handleAddNote}>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder='add title' required/>
            <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder='add content' required/>
            <input type="submit" />
          </form>
        </div>
        <br />
      </div>

    </>
  )
}

export default App
