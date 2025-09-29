// src/utils/date.ts
export function parseLocalDateFromYMD(ymd: string) {
  if (typeof ymd !== 'string') return new Date(ymd);
  const parts = ymd.split('-').map(Number);
  if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return new Date(ymd);
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

export function todayLocalISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateFromYMD(ymd: string) {
  const d = parseLocalDateFromYMD(ymd);
  return d.toLocaleDateString('pt-BR');
}

export function formatDateTimeFromYMDorISO(value: string) {
  try {
    const d = (typeof value === 'string' && value.length === 10)
      ? parseLocalDateFromYMD(value)
      : new Date(value);
    return d.toLocaleString('pt-BR');
  } catch {
    return String(value);
  }
}
