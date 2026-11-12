import { formatDatePtBr } from '../utils/formatters.js';

/** View responsável exclusivamente pela representação imprimível do requerimento. */
export class DocumentView {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.elements = {
      requester: document.querySelector('#preview-requester'),
      title: document.querySelector('#preview-title'),
      description: document.querySelector('#preview-description'),
      media: document.querySelector('#preview-media'),
      date: document.querySelector('#preview-date'),
      signatureName: document.querySelector('#preview-signature-name'),
      logoImage: document.querySelector('#document-logo-image'),
      logoPlaceholder: document.querySelector('#document-logo-placeholder')
    };
    this.eventBus.subscribe('request:updated', (request) => this.render(request));
    this.eventBus.subscribe('logo:updated', (logoData) => this.renderLogo(logoData));
  }

  render(request) {
    this.elements.requester.textContent = request.requesterName || 'Nome do requerente';
    this.elements.title.textContent = request.eventTitle || 'Título do evento';
    this.elements.description.textContent = request.description || 'A descrição objetiva do evento será exibida neste campo.';
    this.elements.media.textContent = request.mediaType || 'Tipo de mídia';
    this.elements.date.textContent = formatDatePtBr(request.requestDate);
    this.elements.signatureName.textContent = request.requesterName || 'Nome do requerente';
  }

  renderLogo(dataUrl) {
    const hasLogo = Boolean(dataUrl);
    this.elements.logoImage.hidden = !hasLogo;
    this.elements.logoPlaceholder.hidden = hasLogo;
    if (hasLogo) this.elements.logoImage.src = dataUrl;
    else this.elements.logoImage.removeAttribute('src');
  }
}
