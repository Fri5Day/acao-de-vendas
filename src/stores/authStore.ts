import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { getCookie, setCookie, deleteCookie } from '@/utils/cookieUtils'
import type { AuthState } from '@/interface/auth/authState'
import type { AuthResponse } from '@/interface/auth/authResponse'

const JWT_COOKIE_NAME = 'jwtToken'
const DEFAULT_ERROR_MESSAGE = 'Falha na autenticação. Por favor, tente novamente.'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    jwtToken: getCookie(JWT_COOKIE_NAME),
    isFetchingToken: false,
    tokenPromise: null
  }),

  actions: {
    async fetchJwtToken(): Promise<string> {
      if (this.jwtToken) return this.jwtToken
      if (this.tokenPromise) return this.tokenPromise

      try {
        this.isFetchingToken = true
        this.tokenPromise = this.authenticate()
        return await this.tokenPromise
      } catch (error: any) {
        this.handleAuthError(error)
        throw error
      } finally {
        this.isFetchingToken = false
        this.tokenPromise = null
      }
    },

    async authenticate(): Promise<string> {
      const response = await api.post<AuthResponse>('/auth', {
        token: import.meta.env.VITE_API_TOKEN,
        sistema: import.meta.env.VITE_API_SISTEMA
      })

      const tokenAcesso = response.data.token_Acesso
      if (tokenAcesso) {
        this.jwtToken = tokenAcesso
        setCookie(JWT_COOKIE_NAME, tokenAcesso)
      }
      return tokenAcesso
    },

    handleAuthError(error: any): void {
      this.logout()
      const errorMessage = error.response?.data?.error || DEFAULT_ERROR_MESSAGE
      console.error('Falha no login:', errorMessage)
      throw new Error(errorMessage)
    },

    logout(): void {
      this.jwtToken = null
      deleteCookie(JWT_COOKIE_NAME)
    }
  }
})
