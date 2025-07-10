import type ItemInterface from "@/interface/item/itemInterface";

interface FilterOptions {
  include: string[];
  exclude: string[];
}

export interface AdditionalFilters {
  variations?: FilterOptions;
  colors?: FilterOptions;
  finishes?: FilterOptions;
}

export const applyAdditionalFilters = (items: ItemInterface[], filters: AdditionalFilters): ItemInterface[] => {
  if (!filters.variations && !filters.colors && !filters.finishes) {
    return items;
  }

  const hasActiveFilters = Object.values(filters).some(filter => 
    filter && (filter.include.length > 0 || filter.exclude.length > 0)
  );

  if (!hasActiveFilters) {
    return items;
  }

  return items.filter(item => {
    if (filters.variations) {
      const value = item.desVariacao as string;
      if (filters.variations.include.length > 0 && !filters.variations.include.includes(value)) return false;
      if (filters.variations.exclude.length > 0 && filters.variations.exclude.includes(value)) return false;
    }

    if (filters.colors) {
      const value = item.desCor as string;
      if (filters.colors.include.length > 0 && !filters.colors.include.includes(value)) return false;
      if (filters.colors.exclude.length > 0 && filters.colors.exclude.includes(value)) return false;
    }

    if (filters.finishes) {
      const value = item.desAcabamento as string;
      if (filters.finishes.include.length > 0 && !filters.finishes.include.includes(value)) return false;
      if (filters.finishes.exclude.length > 0 && filters.finishes.exclude.includes(value)) return false;
    }

    return true;
  });
};