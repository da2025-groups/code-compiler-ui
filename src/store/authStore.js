import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token, user) => {
        // Store token in localStorage for Axios interceptor
        localStorage.setItem('auth-token', token)
        localStorage.setItem('auth-user', JSON.stringify(user))

        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-user')

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',  // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore
