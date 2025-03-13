import { api } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'
import type ItemInterface from '@/interface/item/itemInterface'

export const fetchItems = async (): Promise<{ items: ItemInterface[]; error?: string }> => {
  const authStore = useAuthStore()

  try {
    const token = await authStore.fetchJwtToken() 

    const response = await api.get('/TSMCadGR_Unidades_Codificacao.ExecutarMetodoInterpretado', {
      params: {
        UnitEMetodo: 'ACAO_DE_VENDAS.JsonItens',
        Body: 0
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return { items: response.data }
  } catch (error: any) {
    console.error('Erro ao buscar os dados da API:', error)
    const errorMessage = error.response?.data || 'Falha na comunicação com a API'
    return { items: [], error: errorMessage }
  }
}