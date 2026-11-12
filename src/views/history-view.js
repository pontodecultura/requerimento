import { formatDatePtBr } from '../utils/formatters.js';

export class HistoryView {
  constructor() {
    this.list = document.querySelector('#history-list');
    this.count = document.querySelector('#history-count');
  }

  render(requests, handlers) {
    this.list.replaceChildren();
    this.count.textContent = String(requests.length);

    if (!requests.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-history';
      empty.textContent = 'As solicitações salvas aparecerão aqui.';
      this.list.append(empty);
      return;
    }

    requests.forEach((request) => {
      const item = document.createElement('article');
      item.className = 'history-item';

      const main = document.createElement('div');
      main.className = 'history-item-main';
      const title = document.createElement('span');
      title.className = 'history-item-title';
      title.textContent = request.eventTitle || 'Evento sem título';
      const meta = document.createElement('span');
      meta.className = 'history-item-meta';
      meta.textContent = `${request.requesterName || 'Requerente'} · ${formatDatePtBr(request.requestDate).replace('Irecê – BA, ', '')}`;
      main.append(title, meta);

      const actions = document.createElement('div');
      actions.className = 'history-item-actions';
      const loadButton = document.createElement('button');
      loadButton.type = 'button';
      loadButton.className = 'small-action';
      loadButton.textContent = 'Abrir';
      loadButton.setAttribute('aria-label', `Abrir solicitação ${request.eventTitle || ''}`);
      loadButton.addEventListener('click', () => handlers.onLoad(request));

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'small-action delete';
      deleteButton.textContent = 'Excluir';
      deleteButton.setAttribute('aria-label', `Excluir solicitação ${request.eventTitle || ''}`);
      deleteButton.addEventListener('click', () => handlers.onDelete(request.id));

      actions.append(loadButton, deleteButton);
      item.append(main, actions);
      this.list.append(item);
    });
  }
}
