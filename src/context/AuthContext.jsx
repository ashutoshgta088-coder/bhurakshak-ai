import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const MOCK_ACCOUNTS = [
  {
    email: 'admin@ner.gov.in',
    password: 'admin123',
    role: 'Authority / Field Responder',
    name: 'Rajiv Sharma',
    organization: 'NDMA — Northeast Division',
  },
  {
    email: 'sdrf@assam.gov.in',
    password: 'sdrf2024',
    role: 'Authority / Field Responder',
    name: 'Lt. Col. Priya Borah',
    organization: 'SDRF Assam',
  },
  {
    email: 'citizen@ner.in',
    password: 'guest123',
    role: 'Citizen / General Public',
    name: 'Aarav Khanna',
    organization: 'Citizen',
  },
]

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const login = useCallback((email, password, selectedRole) => {
    const account = MOCK_ACCOUNTS.find(
      a => a.email === email && a.password === password
    )
    if (account) {
      setAuthenticated(true)
      setUserRole(account.role)
      setUserInfo({ name: account.name, email: account.email, organization: account.organization })
      addToast(`Welcome back, ${account.name}!`, 'success')
      return { success: true, role: account.role }
    }
    return { success: false, error: 'Invalid credentials. Please try again.' }
  }, [addToast])

  const register = useCallback((formData) => {
    setAuthenticated(true)
    setUserRole(formData.role)
    setUserInfo({
      name: formData.name,
      email: formData.email,
      organization: formData.organization,
    })
    addToast(`Account created! Welcome, ${formData.name}.`, 'success')
    return { success: true, role: formData.role }
  }, [addToast])

  const logout = useCallback(() => {
    setAuthenticated(false)
    setUserRole(null)
    setUserInfo(null)
    addToast('Signed out successfully.', 'info')
  }, [addToast])

  return (
    <AuthContext.Provider value={{ authenticated, userRole, userInfo, login, register, logout, toasts, addToast }}>
      {children}
      {/* Global Toast Renderer */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>
              {t.type === 'success' ? '✅' : t.type === 'error' ? '🚨' : 'ℹ️'}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
