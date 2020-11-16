export const hasFilter = (filter?: string) => !!filter;
export const isGroupFilter = (filter: string) => filter.startsWith('g:');
export const getGroupFilterText = (filter: string) => filter.substr(2);
export const matchesFilter = (text: string, filter: string) => text.toUpperCase().includes(filter.toUpperCase());