'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export interface Session {
  username: string
  email: string
}

export interface AuthContextValue {
  session: Session | null
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Simulates a 500ms network delay for mock auth operations. */
function simulateDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 500))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession, isLoaded] = useLocalStorage<Session | null>(
    'auth_session',
    null
  )

  const login = async (email: string, _password: string): Promise<void> => {
    await simulateDelay()
    // Mock login: derive a username from the email local-part
    const username = email.split('@')[0]
    setSession({ username, email })
  }

  const signup = async (
    username: string,
    email: string,
    _password: string
  ): Promise<void> => {
    await simulateDelay()
    setSession({ username, email })
  }

  const logout = (): void => {
    setSession(null)
  }

  const value: AuthContextValue = {
    session,
    login,
    signup,
    logout,
    isAuthenticated: session !== null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return ctx
}
