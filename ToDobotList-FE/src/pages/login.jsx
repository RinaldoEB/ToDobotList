import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const loginPage = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error, setError] = useState("")
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
            </div>
        </>
    )
}

export default loginPage