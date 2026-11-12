import test from 'node:test';
import assert from 'node:assert/strict';
import { RequestModel, MEDIA_TYPES } from '../src/models/request-model.js';

test('requerimento novo apresenta erros para campos obrigatórios', () => {
  const model = new RequestModel({ requestDate: '2026-11-12' });
  const result = model.validate();
  assert.equal(result.isValid, false);
  assert.ok(result.errors.requesterName);
  assert.ok(result.errors.eventTitle);
  assert.ok(result.errors.description);
  assert.ok(result.errors.mediaType);
});

test('requerimento válido passa pela validação', () => {
  const model = new RequestModel({
    requesterName: 'Ana da Silva',
    eventTitle: 'Mostra de Educação',
    description: 'Apresentação de projetos escolares da rede municipal.',
    mediaType: 'Fotografia/Vídeo',
    requestDate: '2026-11-12'
  });
  assert.equal(model.validate().isValid, true);
});

test('descrição acima de 500 caracteres é rejeitada', () => {
  const model = new RequestModel({
    requesterName: 'Ana da Silva',
    eventTitle: 'Mostra de Educação',
    description: 'x'.repeat(501),
    mediaType: 'Vídeo',
    requestDate: '2026-11-12'
  });
  assert.equal(model.validate().errors.description, 'A descrição deve ter no máximo 500 caracteres.');
});

test('somente os tipos de mídia previstos são aceitos', () => {
  assert.equal(MEDIA_TYPES.length, 7);
  const model = new RequestModel({
    requesterName: 'Ana da Silva',
    eventTitle: 'Mostra de Educação',
    description: 'Evento escolar.',
    mediaType: 'Transmissão espacial',
    requestDate: '2026-11-12'
  });
  assert.ok(model.validate().errors.mediaType);
});

test('markAsSaved gera identificador e data de criação', () => {
  const model = new RequestModel().markAsSaved();
  assert.ok(model.id);
  assert.ok(model.createdAt);
});

test('data inexistente é rejeitada', () => {
  const model = new RequestModel({
    requesterName: 'Ana da Silva',
    eventTitle: 'Mostra de Educação',
    description: 'Evento escolar.',
    mediaType: 'Fotografia',
    requestDate: '2026-02-31'
  });
  assert.ok(model.validate().errors.requestDate);
});
