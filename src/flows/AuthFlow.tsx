'use client'

import React, { useState, useCallback } from 'react'
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'
import Modal from '@/components/Modal/Modal'
import Alert from '@/components/Alert/Alert'
import Spinner from '@/components/Spinner/Spinner'
import Badge from '@/components/Badge/Badge'
import './AuthFlow.css'

export type AuthFlowState = 
  | 'initial'
  | 'validating'
  | 'success'
  | 'error'
  | 'mfa'
  | 'recovery'
  | 'biometry'
  | 'session_expired'

export interface AuthFlowProps {
  onSuccess?: (user: { id: string; email: string; name: string }) => void
  onError?: (error: string) => void
  onStateChange?: (state: AuthFlowState) => void
}

export const AuthFlow: React.FC<AuthFlowProps> = ({
  onSuccess,
  onError,
  onStateChange,
}) => {
  const [state, setState] = useState<AuthFlowState>('initial')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showMFAModal, setShowMFAModal] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')

  const updateState = useCallback((newState: AuthFlowState) => {
    setState(newState)
    onStateChange?.(newState)
  }, [onStateChange])

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios')
      return
    }

    updateState('validating')
    setError('')

    try {
      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simular MFA
      setShowMFAModal(true)
      updateState('mfa')
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      updateState('error')
      onError?.(error)
    }
  }, [email, password, updateState, onError, error])

  const handleMFASubmit = useCallback(async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setError('Código MFA deve ter 6 dígitos')
      return
    }

    updateState('validating')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setShowMFAModal(false)
      updateState('success')
      onSuccess?.({
        id: '1',
        email,
        name: 'Usuário Demo',
      })

      // Reset após sucesso
      setTimeout(() => {
        setEmail('')
        setPassword('')
        setMfaCode('')
        setError('')
        updateState('initial')
      }, 2000)
    } catch (err) {
      setError('Código MFA inválido')
      updateState('error')
    }
  }, [mfaCode, email, updateState, onSuccess])

  const handleForgotPassword = useCallback(async () => {
    if (!recoveryEmail) {
      setError('Email é obrigatório')
      return
    }

    updateState('recovery')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setError('Email de recuperação enviado com sucesso!')
      setShowForgotPassword(false)
      updateState('initial')
    } catch (err) {
      setError('Erro ao enviar email de recuperação')
      updateState('error')
    }
  }, [recoveryEmail, updateState])

  const handleBiometry = useCallback(async () => {
    updateState('biometry')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      updateState('success')
      onSuccess?.({
        id: '1',
        email: 'user@example.com',
        name: 'Usuário Demo',
      })
    } catch (err) {
      setError('Falha na autenticação biométrica')
      updateState('error')
    }
  }, [updateState, onSuccess])

  return (
    <div className="auth-flow">
      <div className="auth-flow__container">
        <div className="auth-flow__header">
          <h1>Acesso ao Sistema</h1>
          <Badge variant={state === 'success' ? 'success' : state === 'error' ? 'danger' : 'primary'}>
            {state === 'initial' && 'Pronto para login'}
            {state === 'validating' && 'Validando...'}
            {state === 'success' && 'Sucesso!'}
            {state === 'error' && 'Erro'}
            {state === 'mfa' && 'MFA Requerido'}
            {state === 'recovery' && 'Recuperação'}
            {state === 'biometry' && 'Biometria'}
            {state === 'session_expired' && 'Sessão Expirada'}
          </Badge>
        </div>

        {error && (
          <Alert
            variant={state === 'success' ? 'success' : 'danger'}
            title={state === 'success' ? 'Sucesso!' : 'Erro'}
            onDismiss={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {state === 'initial' && (
          <form className="auth-flow__form" onSubmit={e => { e.preventDefault(); handleLogin() }}>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <div className="auth-flow__actions">
              <Button
                variant="primary"
                size="md"
                onClick={handleLogin}
                disabled={!email || !password}
              >
                Entrar
              </Button>

              <Button
                variant="tertiary"
                size="md"
                onClick={() => setShowForgotPassword(true)}
              >
                Esqueci a senha
              </Button>
            </div>

            <div className="auth-flow__divider">ou</div>

            <Button
              variant="secondary"
              size="md"
              onClick={handleBiometry}
              fullWidth
            >
              Entrar com Biometria
            </Button>
          </form>
        )}

        {state === 'validating' && (
          <div className="auth-flow__loading">
            <Spinner size="lg" />
            <p>Validando credenciais...</p>
          </div>
        )}

        {state === 'success' && (
          <div className="auth-flow__success">
            <div className="auth-flow__success-icon">✓</div>
            <h2>Login realizado com sucesso!</h2>
            <p>Redirecionando para o dashboard...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="auth-flow__error">
            <div className="auth-flow__error-icon">✕</div>
            <h2>Erro na autenticação</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => updateState('initial')}
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {state === 'biometry' && (
          <div className="auth-flow__biometry">
            <Spinner size="lg" />
            <p>Aguardando autenticação biométrica...</p>
          </div>
        )}
      </div>

      {/* Modal: Esqueci a Senha */}
      <Modal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        title="Recuperar Senha"
      >
        <div className="auth-flow__modal-content">
          <p>Digite seu email para receber instruções de recuperação:</p>
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={recoveryEmail}
            onChange={e => setRecoveryEmail(e.target.value)}
          />
          <div className="auth-flow__modal-actions">
            <Button
              variant="primary"
              size="md"
              onClick={handleForgotPassword}
              disabled={!recoveryEmail}
            >
              Enviar
            </Button>
            <Button
              variant="tertiary"
              size="md"
              onClick={() => setShowForgotPassword(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: MFA */}
      <Modal
        isOpen={showMFAModal}
        onClose={() => setShowMFAModal(false)}
        title="Autenticação de Dois Fatores"
      >
        <div className="auth-flow__modal-content">
          <p>Digite o código de 6 dígitos do seu autenticador:</p>
          <Input
            label="Código MFA"
            type="text"
            placeholder="000000"
            value={mfaCode}
            onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
          />
          <div className="auth-flow__modal-actions">
            <Button
              variant="primary"
              size="md"
              onClick={handleMFASubmit}
              disabled={mfaCode.length !== 6}
            >
              Verificar
            </Button>
            <Button
              variant="tertiary"
              size="md"
              onClick={() => setShowMFAModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
