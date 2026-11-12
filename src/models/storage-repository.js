const STORAGE_KEYS = Object.freeze({
  draft: 'irece.eventCoverage.draft.v1',
  requests: 'irece.eventCoverage.requests.v1',
  logo: 'irece.eventCoverage.logo.v1'
});

/** Exceção específica para falhas no armazenamento do navegador. */
export class StorageRepositoryError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'StorageRepositoryError';
  }
}

/**
 * Repositório local (Repository Pattern).
 * Encapsula o acesso ao localStorage e mantém a versão das chaves isolada da UI.
 */
export class StorageRepository {
  constructor(storage = window.localStorage, maxRequests = 30) {
    this.storage = storage;
    this.maxRequests = maxRequests;
  }

  readJson(key, fallback) {
    try {
      const raw = this.storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      throw new StorageRepositoryError('Não foi possível ler os dados armazenados neste navegador.', error);
    }
  }

  writeJson(key, value) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      const message = error?.name === 'QuotaExceededError'
        ? 'O armazenamento local está cheio. Remova solicitações antigas ou reduza o tamanho do logotipo.'
        : 'Não foi possível salvar os dados no armazenamento local.';
      throw new StorageRepositoryError(message, error);
    }
  }

  saveDraft(data) { this.writeJson(STORAGE_KEYS.draft, data); }
  loadDraft() { return this.readJson(STORAGE_KEYS.draft, null); }
  removeDraft() {
    try { this.storage.removeItem(STORAGE_KEYS.draft); }
    catch (error) { throw new StorageRepositoryError('Não foi possível limpar o rascunho.', error); }
  }

  listRequests() {
    const requests = this.readJson(STORAGE_KEYS.requests, []);
    return Array.isArray(requests) ? requests : [];
  }

  saveRequest(request) {
    const requests = this.listRequests().filter((item) => item.id !== request.id);
    requests.unshift(request);
    this.writeJson(STORAGE_KEYS.requests, requests.slice(0, this.maxRequests));
  }

  deleteRequest(id) {
    const requests = this.listRequests().filter((item) => item.id !== id);
    this.writeJson(STORAGE_KEYS.requests, requests);
  }

  saveLogo(dataUrl) {
    try { this.storage.setItem(STORAGE_KEYS.logo, dataUrl); }
    catch (error) {
      throw new StorageRepositoryError('Não foi possível salvar o logotipo. A imagem pode ser grande demais para o armazenamento local.', error);
    }
  }

  loadLogo() {
    try { return this.storage.getItem(STORAGE_KEYS.logo); }
    catch (error) { throw new StorageRepositoryError('Não foi possível carregar o logotipo salvo.', error); }
  }

  removeLogo() {
    try { this.storage.removeItem(STORAGE_KEYS.logo); }
    catch (error) { throw new StorageRepositoryError('Não foi possível remover o logotipo.', error); }
  }
}
