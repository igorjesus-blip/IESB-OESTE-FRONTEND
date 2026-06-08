import { format } from 'date-fns'

export function formatDate(timestamp: number) {
  return format(new Date(timestamp), 'dd/MM/yyyy HH:mm')
}
