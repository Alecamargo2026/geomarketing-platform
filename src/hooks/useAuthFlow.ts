import { useState, useCallback } from 'react'

export type AuthFlowState = 
  | 'initial'
  | 'validating'
  | 'success'
  | 'error'
  | 'mfa'
  | 'recovery'
  | 'biometry'
  | 'session_expired'

export interface AuthUser {
  id: string
  email: string
  name: string
  role?: string
  avatar?: string
}

export interface UseAuthFlowReturn {
  state: AuthFlowState
  user: AuthUser | null
  error: string
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  verifyMFA: (code: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  biometricLogin: () => Promise<void>
  setState: (state: AuthFlowState) => void
  setError: (error: string) => void
}

export const useAuthFlow = (): UseAuthFlowReturn => {
  const [state, setState] = useState<AuthFlowState>('initial')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setState('validating')
    setError('')

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Validação básica
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios')
      }

      // Simular MFA
      setState('mfa')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMessage)
      setState('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyMFA = useCallback(async (code: string) => {
    setIsLoading(true)
    setState('validating')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (code.length !== 6) {
        throw new Error('Código MFA deve ter 6 dígitos')
      }

      // Simular sucesso
      const mockUser: AuthUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Usuário Demo',
        role: 'admin',
      }

      setUser(mockUser)
      setState('success')

      // Reset após 2 segundos
      setTimeout(() => {
        setState('initial')
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar MFA'
      setError(errorMessage)
      setState('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true)
    setState('recovery')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (!email) {
        throw new Error('Email é obrigatório')
      }

      setError('Email de recuperação enviado com sucesso!')
      setState('initial')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar email'
      setError(errorMessage)
      setState('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const biometricLogin = useCallback(async () => {
    setIsLoading(true)
    setState('biometry')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockUser: AuthUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Usuário Demo',
        role: 'admin',
      }

      setUser(mockUser)
      setState('success')

      setTimeout(() => {
        setState('initial')
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha na autenticação biométrica'
      setError(errorMessage)
      setState('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setState('initial')
    setError('')
  }, [])

  return {
    state,
    user,
    error,
    isLoading,
    login,
    logout,
    verifyMFA,
    resetPassword,
    biometricLogin,
    setState,
    setError,
  }
}
