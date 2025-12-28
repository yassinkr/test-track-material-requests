
// src/components/Auth.tsx
import { useState, FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'

type AuthMode = 'signin' | 'signup'

export const Auth = () => {
  const { user, signUp, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<AuthMode>('signin')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        await signUp(email, password)
        setMessage('Check your email for confirmation link!')
      } else {
        await signIn(email, password)
        setMessage('Signed in successfully!')
      }
      setEmail('')
      setPassword('')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setMessage('Signed out successfully!')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-2">You're signed in as:</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-mono text-gray-700">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Supabase Auth
        </h1>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-md font-medium ${
              mode === 'signin' ? 'bg-white text-purple-600 shadow' : 'text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-md font-medium ${
              mode === 'signup' ? 'bg-white text-purple-600 shadow' : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}
