export function getLocalDateISO(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDatePtBr(isoDate) {
  if (!isoDate) return 'Irecê – BA, ____ de ______________ de ______.';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return 'Irecê – BA, ____ de ______________ de ______.';
  }
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day, 12, 0, 0);
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(date);
  return `Irecê – BA, ${formatted}.`;
}

export function createRequestId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `req-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

export function createSuggestedFilename(requesterName, eventTitle) {
  const base = `${requesterName || 'requerente'}-${eventTitle || 'evento'}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 72);
  return `requerimento-cobertura-${base || 'evento'}`;
}
