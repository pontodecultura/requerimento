import { RequestModel } from '../models/request-model.js';

/** Controller que coordena formulário, entidade de domínio e repositório. */
export class RequestController {
  constructor({ formView, documentView, historyView, repository, eventBus, logoService, exporter }) {
    this.formView = formView;
    this.documentView = documentView;
    this.historyView = historyView;
    this.repository = repository;
    this.eventBus = eventBus;
    this.logoService = logoService;
    this.exporter = exporter;
    this.request = new RequestModel();
    this.logoData = null;
  }

  initialize() {
    this.formView.bindHandlers({
      onFormChange: () => this.handleFormChange(),
      onLogoSelected: (file) => this.handleLogoSelected(file),
      onSave: () => this.saveRequest(),
      onNew: () => this.startNewRequest(),
      onExport: () => this.exportPdf(),
      onRemoveLogo: () => this.removeLogo()
    });

    this.logoData = this.repository.loadLogo();
    this.formView.setLogo(this.logoData);
    this.eventBus.publish('logo:updated', this.logoData);

    const draft = this.repository.loadDraft();
    if (draft) this.request = new RequestModel(draft);
    this.formView.setValues(this.request.toJSON());
    this.publishRequest();
    this.renderHistory();
    this.formView.showFeedback(draft ? 'Rascunho anterior restaurado.' : 'Salvamento automático ativado.');
  }

  syncRequestFromForm() {
    this.request.update(this.formView.getValues());
    this.publishRequest();
    return this.request;
  }

  publishRequest() { this.eventBus.publish('request:updated', this.request); }

  handleFormChange() {
    this.formView.updateDescriptionCounter();
    this.syncRequestFromForm();
    try {
      this.repository.saveDraft(this.request.toJSON());
      this.formView.showFeedback('Rascunho salvo automaticamente.');
    } catch (error) {
      this.formView.showFeedback(error.message, true);
    }
  }

  async handleLogoSelected(file) {
    if (!file) return;
    try {
      const processedLogo = await this.logoService.process(file);
      this.repository.saveLogo(processedLogo);
      this.logoData = processedLogo;
      this.formView.setLogo(processedLogo);
      this.eventBus.publish('logo:updated', processedLogo);
      this.formView.showFeedback('Logotipo atualizado e salvo neste navegador.');
    } catch (error) {
      this.formView.showFeedback(error.message || 'Não foi possível carregar o logotipo.', true);
      this.formView.setLogo(this.logoData);
    }
  }

  removeLogo() {
    try {
      this.repository.removeLogo();
      this.logoData = null;
      this.formView.setLogo(null);
      this.eventBus.publish('logo:updated', null);
      this.formView.showFeedback('Logotipo removido.');
    } catch (error) {
      this.formView.showFeedback(error.message, true);
    }
  }

  validateRequest() {
    this.syncRequestFromForm();
    const validation = this.request.validate();
    if (!validation.isValid) {
      const firstError = Object.keys(validation.errors)[0];
      this.formView.showFeedback(validation.errors[firstError], true);
      this.formView.focusField(firstError);
    }
    return validation.isValid;
  }

  saveRequest() {
    if (!this.validateRequest()) return;
    try {
      this.request.markAsSaved();
      this.repository.saveRequest(this.request.toJSON());
      this.repository.saveDraft(this.request.toJSON());
      this.renderHistory();
      this.formView.showFeedback('Solicitação salva no histórico deste navegador.');
    } catch (error) {
      this.formView.showFeedback(error.message, true);
    }
  }

  exportPdf() {
    if (!this.validateRequest()) return;
    if (!this.logoData) {
      const continueWithoutLogo = window.confirm('Nenhum logotipo foi inserido. Deseja gerar o documento mesmo assim?');
      if (!continueWithoutLogo) return;
    }
    try {
      this.exporter.export(this.request.toJSON());
    } catch (error) {
      this.formView.showFeedback(`Não foi possível abrir a impressão: ${error.message}`, true);
    }
  }

  startNewRequest() {
    const hasContent = Object.values(this.formView.getValues()).some((value) => Boolean(value));
    if (hasContent && !window.confirm('Iniciar um novo requerimento? Os dados atuais deixarão de ser o rascunho ativo, mas as solicitações salvas no histórico serão mantidas.')) return;
    this.request = new RequestModel();
    this.formView.clear();
    this.publishRequest();
    try {
      this.repository.saveDraft(this.request.toJSON());
      this.formView.showFeedback('Novo requerimento iniciado. O logotipo foi mantido.');
    } catch (error) {
      this.formView.showFeedback(error.message, true);
    }
  }

  loadRequest(requestData) {
    this.request = new RequestModel(requestData);
    this.formView.setValues(this.request.toJSON());
    this.publishRequest();
    try {
      this.repository.saveDraft(this.request.toJSON());
      this.formView.showFeedback('Solicitação carregada para edição.');
    } catch (error) {
      this.formView.showFeedback(error.message, true);
    }
  }

  deleteRequest(id) {
    if (!window.confirm('Excluir esta solicitação do histórico local?')) return;
    try {
      this.repository.deleteRequest(id);
      this.renderHistory();
      this.formView.showFeedback('Solicitação excluída do histórico.');
    } catch (error) {
      this.formView.showFeedback(error.message, true);
    }
  }

  renderHistory() {
    this.historyView.render(this.repository.listRequests(), {
      onLoad: (request) => this.loadRequest(request),
      onDelete: (id) => this.deleteRequest(id)
    });
  }
}
