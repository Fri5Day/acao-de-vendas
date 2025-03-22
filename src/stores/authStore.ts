import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: sessionStorage.getItem('jwtToken') as string | null,
    isFetchingToken: false,
    tokenPromise: null as Promise<string> | null
  }),

  actions: {
    async fetchJwtToken(): Promise<string> {
      if (this.jwtToken) {
        return this.jwtToken
      }

      if (this.tokenPromise) {
        return this.tokenPromise
      }

      try {
        this.isFetchingToken = true
        this.tokenPromise = api
          .post('/auth', {
            token: import.meta.env.VITE_API_TOKEN,
            sistema: import.meta.env.VITE_API_SISTEMA
          })
          .then((response) => {
            const tokenAcesso = response.data.token_Acesso
            if (tokenAcesso) {
              this.jwtToken = tokenAcesso
              sessionStorage.setItem('jwtToken', tokenAcesso)
            }
            return tokenAcesso
          })

        return await this.tokenPromise
      } catch (error) {
        this.logout()
        console.error('Falha no login:', error)
        throw new Error('Falha na autenticação. Por favor, tente novamente.')
      } finally {
        this.isFetchingToken = false
        this.tokenPromise = null
      }
    },

    logout() {
      this.jwtToken = null
      sessionStorage.removeItem('jwtToken')
    }
  }
})
