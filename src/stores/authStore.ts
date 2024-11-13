import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: localStorage.getItem('jwtToken') as string | null
  }),

  actions: {
    async fetchJwtToken() {
      if (this.jwtToken) {
        return this.jwtToken
      }

      try {
        const _token = import.meta.env.VITE_API_TOKEN
        const response = await api.post('/auth', {
          _token,
          username: import.meta.env.VITE_API_USERNAME,
          password: import.meta.env.VITE_API_PASSWORD,
          sistema: import.meta.env.VITE_API_SISTEMA
        })

        const tokenAcesso = response.data.token_Acesso
        if (tokenAcesso) {
          this.jwtToken = tokenAcesso
          localStorage.setItem('jwtToken', tokenAcesso)
        }
        return tokenAcesso
      } catch (error) {
        console.error('Falha no login:', error)
        throw new Error('Falha durante o login')
      }
    },

    clearJwtToken() {
      this.jwtToken = null
      localStorage.removeItem('jwtToken')
    }
  }
})
