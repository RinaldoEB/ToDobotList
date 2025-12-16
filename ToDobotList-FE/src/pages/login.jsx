import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const loginPage = () => {
    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error, setError] = useState("")
    const [buttonRegister,setButtonRegister] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()

        const res = await fetch('http://localhost:3007/api/user/login', {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({email, password})
        })

        const data = await res.json()

        if(!res.ok) {
            setError(data.message)
            return
        }

        localStorage.setItem("token", data.token)
        localStorage.setItem("name", data.name)
        navigate('/')
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const body = {
            name : newName,
            email : newEmail,
            password : newPassword
        }

        const res = await fetch('http://localhost:3007/api/user/register', {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)
        })

        const data = await res.json()
        
        if(!res.ok) {
            console.log(data.message)
            return
        }
        if(res.status === 500) {
            alert(data.message)
        }else {
            alert(`data berhasil di tambah`)
        }

       setNewName("")
       setNewEmail("")
       setNewPassword("")
    }

    const handleButtonRegister = () => {
        setButtonRegister(prev => !prev)
    }

    
    
    return (
        <>
            <div>
                <form onSubmit={handleLogin}>
                    <h1>LOGIN PAGE</h1>
                    {error && <p style={{ color : "red" }}>{error}</p>}

                    <input type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    />

                    <input type="password" 
                    placeholder="password"
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                    />

                    <input type="submit" />
                </form>

                <button type="button" onClick={handleButtonRegister}>
                    {buttonRegister ? "Back to Login" : "U dont have account ?"}
                </button>
                {buttonRegister && (

                    <form onSubmit={handleRegister}>
                        {error && <p style={{ color : "red" }}>{error}</p>}
                        <h1>REGISTER</h1>
                        <input type="text" 
                        placeholder="name" 
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        required
                        />
                        <input type="email" 
                        placeholder="Email" 
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        required
                        />
                        <input type="password" 
                        placeholder="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        />
                        <input type="submit" />
                    </form>
                )}

            </div>
        </>
    )
}

export default loginPage