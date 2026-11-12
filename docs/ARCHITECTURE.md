# Arquitetura do projeto

## Visão geral

Aplicação client-side, executada no navegador por meio de um servidor HTTP local.
Não existe backend: formulário, histórico e logotipo são persistidos no `localStorage`.

```text
index.html
  └── src/app.js (composition root)
        ├── models/
        │     ├── RequestModel
        │     └── StorageRepository
        ├── views/
        │     ├── FormView
        │     ├── DocumentView
        │     └── HistoryView
        ├── controllers/
        │     └── RequestController
        ├── services/
        │     ├── LogoService
        │     └── PdfExporter / ExporterFactory
        └── utils/
              ├── EventBus
              └── formatters
```

## Responsabilidades

- **Model:** `RequestModel` concentra os dados e validações de domínio do requerimento.
- **View:** as views atualizam elementos da interface sem decidir regras de negócio.
- **Controller:** `RequestController` coordena ações, valida os dados e chama serviços.
- **Repository:** `StorageRepository` isola leitura e escrita no `localStorage`.
- **Service:** `LogoService` trata a imagem; o exportador encapsula a impressão em PDF.

## Padrões de projeto

| Padrão | Implementação | Finalidade |
|---|---|---|
| MVC | Models, Views e Controllers separados | Reduzir acoplamento entre dados, interface e fluxo |
| Repository | `StorageRepository` | Centralizar persistência e tratamento de falhas |
| Observer | `EventBus` | Notificar alterações sem dependência direta entre views |
| Strategy | `PrintPdfExporter` | Isolar a forma de exportação |
| Factory | `ExporterFactory` | Centralizar a criação de exportadores |

## Fluxo de preenchimento

1. O formulário emite eventos de entrada/alteração.
2. O controller atualiza `RequestModel`.
3. O controller grava o rascunho no repositório local.
4. O controller publica `request:updated` no `EventBus`.
5. `DocumentView` recebe o evento e atualiza a pré-visualização.

## Persistência

Chaves versionadas:

- `irece.eventCoverage.draft.v1`: rascunho atual.
- `irece.eventCoverage.requests.v1`: histórico limitado a 30 itens.
- `irece.eventCoverage.logo.v1`: logotipo convertido para imagem JPEG.

A persistência é local ao perfil do navegador e não substitui backup institucional,
controle de acesso, trilha de auditoria ou banco de dados centralizado.

## Estratégia de PDF

`PrintPdfExporter` ajusta o título do documento e chama `window.print()`. As regras
em `assets/css/print.css` ocultam a interface de edição e formatam somente o documento
em A4 retrato. O usuário seleciona "Salvar como PDF" na caixa de impressão.

## Evolução recomendada

Para uso institucional multiusuário, a próxima evolução deve introduzir API autenticada,
banco de dados central, controle de permissões, protocolo, registro de tramitação e
backup. O `StorageRepository` funciona como ponto de substituição da persistência local.
