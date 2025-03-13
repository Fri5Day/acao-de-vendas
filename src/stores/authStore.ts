import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: sessionStorage.getItem('jwtToken') as string | null,
    isFetchingToken: false
  }),

  actions: {
    async fetchJwtToken() {
      if (this.jwtToken) {
        return this.jwtToken
      }

      if (this.isFetchingToken) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return this.fetchJwtToken()
      }

      try {
        this.isFetchingToken = true
        const response = await api.post('/auth', {
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
        throw error
      } finally {
        this.isFetchingToken = false
      }
    }
  }
})
