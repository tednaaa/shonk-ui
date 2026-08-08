export function formatDate(date: Date, formatter?: (date: Date) => string): string {
  if (formatter)
    return formatter(date);
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}
