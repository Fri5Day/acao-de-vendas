interface FilterOptions {
  include: string[];
  exclude: string[];
}

export default interface AdditionalFilters {
  variations?: FilterOptions;
  colors?: FilterOptions;
  finishes?: FilterOptions;
}