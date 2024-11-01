import { api } from '@/services/api';
import type ItemInterface from '@/interface/item';

const token = import.meta.env.VITE_API_TOKEN;

export const fetchItems = async (): Promise<{ items: ItemInterface[]; error?: string }> => { 
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
    return { items: response.data };
  } catch (error: any) {
    console.error('Erro ao buscar os dados da API:', error);
    const errorMessage = error.response?.data || 'Falha na cominucação com a API, verifique sua conexão com a rede.';
    return { items: [], error: errorMessage }; 
  }
};
