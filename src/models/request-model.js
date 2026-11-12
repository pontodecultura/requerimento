import { createRequestId, getLocalDateISO } from '../utils/formatters.js';

export const MEDIA_TYPES = Object.freeze([
  'Fotografia',
  'Vídeo',
  'Fotografia/Vídeo',
  'Gravação',
  'Documentário',
  'Produção Musical',
  'Cobertura Total do Evento'
]);

/** Entidade de domínio: representa uma solicitação de cobertura. */
export class RequestModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.requesterName = String(data.requesterName || '').trim();
    this.eventTitle = String(data.eventTitle || '').trim();
    this.description = String(data.description || '').trim();
    this.mediaType = String(data.mediaType || '');
    this.requestDate = data.requestDate || getLocalDateISO();
    this.createdAt = data.createdAt || null;
  }

  update(data = {}) {
    this.requesterName = String(data.requesterName ?? this.requesterName).trim();
    this.eventTitle = String(data.eventTitle ?? this.eventTitle).trim();
    this.description = String(data.description ?? this.description).trim();
    this.mediaType = String(data.mediaType ?? this.mediaType);
    this.requestDate = String(data.requestDate ?? this.requestDate);
  }

  validate() {
    const errors = {};
    if (!this.requesterName) errors.requesterName = 'Informe o nome do requerente.';
    if (!this.eventTitle) errors.eventTitle = 'Informe o título do evento.';
    if (!this.description) errors.description = 'Informe a descrição do evento.';
    if (this.description.length > 500) errors.description = 'A descrição deve ter no máximo 500 caracteres.';
    if (!MEDIA_TYPES.includes(this.mediaType)) errors.mediaType = 'Selecione um tipo de mídia válido.';
    const dateParts = this.requestDate.split('-').map(Number);
    const date = dateParts.length === 3 ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 12) : null;
    const isValidDate = date && /^\d{4}-\d{2}-\d{2}$/.test(this.requestDate)
      && date.getFullYear() === dateParts[0]
      && date.getMonth() === dateParts[1] - 1
      && date.getDate() === dateParts[2];
    if (!isValidDate) errors.requestDate = 'Informe uma data válida.';
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  toJSON() {
    return {
      id: this.id,
      requesterName: this.requesterName,
      eventTitle: this.eventTitle,
      description: this.description,
      mediaType: this.mediaType,
      requestDate: this.requestDate,
      createdAt: this.createdAt
    };
  }

  markAsSaved() {
    if (!this.id) this.id = createRequestId();
    if (!this.createdAt) this.createdAt = new Date().toISOString();
    return this;
  }
}
