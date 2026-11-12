import { getLocalDateISO } from '../utils/formatters.js';

export class FormView {
  constructor() {
    this.form = document.querySelector('#request-form');
    this.fields = {
      requesterName: document.querySelector('#requester-name'),
      eventTitle: document.querySelector('#event-title'),
      description: document.querySelector('#event-description'),
      mediaType: document.querySelector('#media-type'),
      requestDate: document.querySelector('#request-date')
    };
    this.logoInput = document.querySelector('#logo-upload');
    this.saveButton = document.querySelector('#save-request');
    this.newButton = document.querySelector('#new-request');
    this.exportButton = document.querySelector('#generate-pdf');
    this.removeLogoButton = document.querySelector('#remove-logo');
    this.descriptionCounter = document.querySelector('#description-counter');
    this.feedback = document.querySelector('#feedback');
    this.logoThumbImage = document.querySelector('#logo-thumb-image');
    this.logoThumbPlaceholder = document.querySelector('#logo-thumb-placeholder');
  }

  bindHandlers(handlers) {
    this.form.addEventListener('input', () => handlers.onFormChange());
    this.form.addEventListener('change', (event) => {
      if (event.target !== this.logoInput) handlers.onFormChange();
    });
    this.logoInput.addEventListener('change', (event) => handlers.onLogoSelected(event.target.files?.[0]));
    this.saveButton.addEventListener('click', handlers.onSave);
    this.newButton.addEventListener('click', handlers.onNew);
    this.exportButton.addEventListener('click', handlers.onExport);
    this.removeLogoButton.addEventListener('click', handlers.onRemoveLogo);
  }

  getValues() {
    return Object.fromEntries(Object.entries(this.fields).map(([key, element]) => [key, element.value]));
  }

  setValues(values = {}) {
    for (const [key, element] of Object.entries(this.fields)) {
      if (Object.hasOwn(values, key)) element.value = values[key] ?? '';
    }
    if (!this.fields.requestDate.value) this.fields.requestDate.value = getLocalDateISO();
    this.updateDescriptionCounter();
  }

  clear() {
    this.form.reset();
    this.fields.requestDate.value = getLocalDateISO();
    this.updateDescriptionCounter();
  }

  updateDescriptionCounter() {
    const length = this.fields.description.value.length;
    this.descriptionCounter.textContent = `${length} / 500`;
    this.descriptionCounter.classList.toggle('is-limit', length >= 500);
  }

  setLogo(dataUrl) {
    const hasLogo = Boolean(dataUrl);
    this.logoThumbImage.hidden = !hasLogo;
    this.logoThumbPlaceholder.hidden = hasLogo;
    this.removeLogoButton.hidden = !hasLogo;
    if (hasLogo) this.logoThumbImage.src = dataUrl;
    else this.logoThumbImage.removeAttribute('src');
    this.logoInput.value = '';
  }

  showFeedback(message, isError = false) {
    this.feedback.textContent = message;
    this.feedback.classList.toggle('is-error', isError);
  }

  focusField(fieldName) {
    this.fields[fieldName]?.focus();
  }
}
