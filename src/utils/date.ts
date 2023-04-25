export function formatDate(dateString: string) {
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  const hour = dateString.substring(8, 10)
  const minute = dateString.substring(10, 12)
  return `${year}-${month}-${day} ${hour}:${minute}`
}
