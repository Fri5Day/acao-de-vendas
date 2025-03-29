import { api } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import type ItemInterface from '@/interface/item/itemInterface'

class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

export const fetchItems = async (): Promise<ItemInterface[]> => {
  const authStore = useAuthStore()

  try {
    const token = await authStore.fetchJwtToken()

    if (!token) {
      throw new ApiError('Token de autenticação não disponível')
    }

    const response = await api.get('/TSMCadGR_Unidades_Codificacao.ExecutarMetodoInterpretado', {
      params: {
        UnitEMetodo: 'ACAO_DE_VENDAS.JsonItens',
        Body: 0
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!Array.isArray(response.data)) {
      throw new ApiError('Formato de dados inválido na resposta da API')
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      const status = (error as any).response?.status
      const data = (error as any).response?.data
      const message = data.error
      
      if (status === 401) {
        throw new ApiError('Não autorizado.', status, data)
      }
      
      throw new ApiError(message, status, data)
    }

    throw new ApiError('Erro desconhecido ao buscar os dados')
  }
}