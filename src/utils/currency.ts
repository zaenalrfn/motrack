export const formatRupiah = (val: string | number): string => {
  const str = String(val).replace(/\D/g, '')
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const parseRupiah = (val: string): number => {
  return Number(val.replace(/\./g, ''))
}
