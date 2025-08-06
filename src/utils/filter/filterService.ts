import type ItemInterface from '@/interface/item/itemInterface';

export const filterItems = (items: ItemInterface[], filterType: string, filterValue: string) => {
  if (!filterValue) return items;

  const searchValue = filterValue.toLowerCase();
  
  if (filterType === 'Código') {
    return items.filter((item) => item.item.toString() === filterValue);
  }
  
  if (filterType === 'Descrição') {
    return items.filter((item) => item.descricao.toLowerCase().includes(searchValue));
  }

  return items;
};
