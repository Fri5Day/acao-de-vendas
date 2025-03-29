export default interface FilterConfig {
    key: 'variations' | 'colors' | 'finishes'
    label: string
    icon: string
    items: string[]
    selectedItems: string[]
    filterType: 'include' | 'exclude'
}
  