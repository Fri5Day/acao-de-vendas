import type ItemInterface from '@/interface/item';

export const filterProducts = (produtos: ItemInterface[], filterType: string, filterValue: string) => {
  if (!filterValue) return produtos;

  return produtos.filter((produto) => {
    if (filterType === 'Descrição') {
      return produto.descricao.toLowerCase().includes(filterValue.toLowerCase());
    } else if (filterType === 'Código') {
      return produto.item.toString() === filterValue;
    }
    return true;
  });
};
