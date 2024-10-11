import { api } from '@/services/api';
import type ItemInterface from '@/interface/item';

const token = import.meta.env.VITE_API_TOKEN;

export const fetchProducts = async (): Promise<{ produtos: ItemInterface[]; error?: string }> => { 
  try {
    const response = await api.get('/TSMCadGR_Unidades_Codificacao.ExecutarMetodoInterpretado', {
      params: {
        UnitEMetodo: 'ACAO_DE_VENDAS.JsonItens',
        Body: 0
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { produtos: response.data };
  } catch (error: any) {
    console.error('Erro ao buscar os dados da API:', error);
    const errorMessage = error.response?.data || 'Erro desconhecido ao buscar dados da API';
    return { produtos: [], error: errorMessage }; 
  }
};
