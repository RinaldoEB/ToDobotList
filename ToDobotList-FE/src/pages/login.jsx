import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [newName, setNewName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [registerError, setRegisterError] = useState("")
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const res = await fetch('http://localhost:3007/api/user/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            })

            const data = await res.json()

            if(!res.ok) {
                setError(data.message || "Login failed")
                return
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("name", data.name)
            navigate('/')
        } catch (err) {
            setError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError("")
        setIsLoading(true)

        try {
            const body = {
                name: newName,
                email: newEmail,
                password: newPassword
            }

            const res = await fetch('http://localhost:3007/api/user/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            const data = await res.json()
            
            if(!res.ok) {
                setRegisterError(data.message || "Registration failed")
                console.log(data.message)
                return
            }

            if(res.status === 500) {
                setRegisterError(data.message)
            } else {
                alert(`Registration successful! Please login with your new account.`)
                setShowRegisterModal(false)
                resetRegisterForm()
            }
        } catch (err) {
            setRegisterError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const resetRegisterForm = () => {
        setNewName("")
        setNewEmail("")
        setNewPassword("")
        setRegisterError("")
    }

    const openRegisterModal = () => {
        setShowRegisterModal(true)
    }

    const closeRegisterModal = () => {
        setShowRegisterModal(false)
        resetRegisterForm()
    }

    // Close modal when clicking outside
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showRegisterModal) {
                closeRegisterModal()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [showRegisterModal])

    return (
        <>
            {/* Background */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                
                {/* Login Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                            <p className="text-gray-600 mt-2">Sign in to continue</p>
                        </div>
                        
                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your password"
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : "Sign In"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                                </div>
                            </div>
                        </div>

                        {/* Register Button */}
                        <div className="mt-6">
                            <button 
                                type="button" 
                                onClick={openRegisterModal}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-300 shadow-md hover:shadow-lg"
                            >
                                Create New Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Register Modal */}
                {showRegisterModal && (
                    <>
                        {/* Overlay */}
                        <div 
                            className="fixed inset-0 bg-white bg-opacity-50 z-40 transition-opacity duration-300"
                            onClick={closeRegisterModal}
                        ></div>
                        
                        {/* Modal */}
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div 
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                                        <p className="text-gray-600 text-sm">Join our community</p>
                                    </div>
                                    <button
                                        onClick={closeRegisterModal}
                                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition duration-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6">
                                    <form onSubmit={handleRegister} className="space-y-5">
                                        {registerError && (
                                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                                                {registerError}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="Enter your full name" 
                                                value={newName}
                                                onChange={e => setNewName(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input 
                                                type="email" 
                                                placeholder="Enter your email" 
                                                value={newEmail}
                                                onChange={e => setNewEmail(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <input 
                                                type="password" 
                                                placeholder="Create a strong password"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                required
                                                minLength="6"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition duration-200"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Must be at least 6 characters long
                                            </p>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Account...
                                                </>
                                            ) : "Create Account"}
                                        </button>
                                    </form>

                                    {/* Alternative Sign Up */}
                                    <div className="mt-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Login Link */}
                                    <div className="mt-6 text-center text-sm">
                                        <p className="text-gray-600">
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={closeRegisterModal}
                                                className="text-green-600 font-semibold hover:underline"
                                            >
                                                Sign in
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default LoginPage