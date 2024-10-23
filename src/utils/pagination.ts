export function getPaginatedItems(items: any[], currentPage: number, itemsPerPage: number) {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }
  