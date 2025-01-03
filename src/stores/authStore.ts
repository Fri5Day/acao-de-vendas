import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: sessionStorage.getItem('jwtToken') as string | null
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
          sessionStorage.setItem('jwtToken', tokenAcesso)
        }
        return tokenAcesso
      } catch (error) {
        console.error('Falha no login:', error)
      }
    },

    clearJwtToken() {
      this.jwtToken = null
      sessionStorage.removeItem('jwtToken')
    }
  }
})
