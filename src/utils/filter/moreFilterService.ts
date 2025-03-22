import type { ItemDetalhado } from "@/interface/item/itemDetalhadoInterface";

interface FilterOptions {
  include: string[];
  exclude: string[];
}

interface AdditionalFilters {
  variations?: FilterOptions;
  colors?: FilterOptions;
  finishes?: FilterOptions;
}

export const applyAdditionalFilters = (items: ItemDetalhado[], filters: AdditionalFilters): ItemDetalhado[] => {
  let result = items;

  if (filters.variations) {
    result = applyFilterOptions(result, filters.variations, 'desVariacao');
  }
  if (filters.colors) {
    result = applyFilterOptions(result, filters.colors, 'desCor');
  }
  if (filters.finishes) {
    result = applyFilterOptions(result, filters.finishes, 'desAcabamento');
  }

  return result;
};

const applyFilterOptions = (
  items: ItemDetalhado[],
  options: FilterOptions,
  property: keyof ItemDetalhado
): ItemDetalhado[] => {
  let filtered = items;

  // Aplicar inclusões
  if (options.include.length > 0) {
    filtered = filtered.filter(item => options.include.includes(item[property] as string));
  }

  // Aplicar exclusões
  if (options.exclude.length > 0) {
    filtered = filtered.filter(item => !options.exclude.includes(item[property] as string));
  }

  return filtered;
};