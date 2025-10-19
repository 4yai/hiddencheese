import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('lp_jwt')
    if (t) setToken(t)
  }, [])

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {token ? (
          <Dashboard key="dash" onLogout={() => { localStorage.removeItem('lp_jwt'); setToken(null) }} />
        ) : (
          <AuthScreen key="auth" onAuth={(t) => { localStorage.setItem('lp_jwt', t); setToken(t) }} />
        )}
      </AnimatePresence>
    </div>
  )
}
