import { EventBus } from './utils/event-bus.js';
import { StorageRepository } from './models/storage-repository.js';
import { FormView } from './views/form-view.js';
import { DocumentView } from './views/document-view.js';
import { HistoryView } from './views/history-view.js';
import { LogoService } from './services/logo-service.js';
import { ExporterFactory } from './services/pdf-exporter.js';
import { RequestController } from './controllers/request-controller.js';

function showFatalError(error) {
  const feedback = document.querySelector('#feedback');
  if (feedback) {
    feedback.textContent = `Falha ao iniciar a aplicação: ${error.message}`;
    feedback.classList.add('is-error');
  }
  console.error('[Gerador de Requerimento]', error);
}

try {
  const eventBus = new EventBus();
  const repository = new StorageRepository();
  const formView = new FormView();
  const documentView = new DocumentView(eventBus);
  const historyView = new HistoryView();
  const logoService = new LogoService();
  const exporter = ExporterFactory.create('pdf');

  const controller = new RequestController({
    formView,
    documentView,
    historyView,
    repository,
    eventBus,
    logoService,
    exporter
  });
  controller.initialize();
} catch (error) {
  showFatalError(error);
}
