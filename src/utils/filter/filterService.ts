import type ItemInterface from '@/interface/item/itemInterface';

export const filterItems = (items: ItemInterface[], filterType: string, filterValue: string) => {
  if (!filterValue) return items;

  const searchValue = filterValue.toLowerCase();
  
  // Otimização para busca por código
  if (filterType === 'Código') {
    return items.filter((item) => item.item.toString() === filterValue);
  }
  
  // Otimização para busca por descrição
  if (filterType === 'Descrição') {
    return items.filter((item) => item.descricao.toLowerCase().includes(searchValue));
  }

  return items;
};
