GERADOR DE REQUERIMENTO PARA COBERTURA DE EVENTO
Secretaria Municipal de Educação de Irecê – BA
Versão: 1.1.0

1. OBJETIVO
-----------
Aplicação web local para preencher, visualizar, salvar e imprimir requerimentos de
solicitação de cobertura de eventos da Rede Municipal de Educação de Irecê – BA.
O projeto utiliza HTML5, CSS3 e JavaScript (ES Modules), sem bibliotecas externas,
servidor de aplicação, conta de usuário ou conexão com serviços de terceiros.

2. REQUISITOS
-------------
- Navegador atualizado: Brave, Google Chrome, Opera, Mozilla Firefox ou Microsoft Edge.
- Python 3 instalado para iniciar o servidor local (recomendado), OU uma extensão
  como Live Server no Visual Studio Code.
- Não é necessário instalar dependências JavaScript ou executar npm install.

3. COMO EXECUTAR NO WINDOWS
---------------------------
Opção A – inicialização automática:
1. Extraia todo o conteúdo do arquivo ZIP para uma pasta.
2. Abra a pasta gerador_requerimento_irece.
3. Execute o arquivo iniciar_windows.bat.
4. O navegador será aberto em http://localhost:8000.
5. Mantenha a janela do terminal aberta enquanto utilizar o sistema.

Opção B – pelo terminal:
1. Abra o Prompt de Comando ou PowerShell na pasta do projeto.
2. Execute: py -m http.server 8000
   Caso o comando py não exista, tente: python -m http.server 8000
3. Acesse http://localhost:8000 no navegador.

4. COMO EXECUTAR NO LINUX OU MACOS
----------------------------------
1. Extraia o ZIP e abra o terminal na pasta do projeto.
2. Dê permissão de execução ao script, se necessário: chmod +x iniciar_unix.sh
3. Execute: ./iniciar_unix.sh
4. Acesse http://localhost:8000 no navegador.
   Alternativamente, execute: python3 -m http.server 8000

IMPORTANTE: não é recomendado abrir index.html diretamente com file://. A aplicação
utiliza módulos JavaScript (ES Modules), que funcionam de forma mais consistente
quando servidos por localhost.

5. COMO PREENCHER E GERAR O PDF
-------------------------------
1. Preencha o nome do requerente.
2. Informe o título do evento.
3. Escreva uma sinopse objetiva com até 500 caracteres.
4. Selecione uma das opções de mídia:
   - Fotografia
   - Vídeo
   - Fotografia/Vídeo
   - Gravação
   - Documentário
   - Produção Musical
   - Cobertura Total do Evento
5. Confira a data da solicitação. O campo começa preenchido com a data local do
   dispositivo e pode ser alterado.
6. Envie o logotipo oficial do órgão. Recomenda-se uma imagem quadrada (1:1), em
   PNG, JPG, WEBP ou SVG. O programa ajusta a imagem para um quadro de até 600 px.
7. Confira a pré-visualização do requerimento.
8. Clique em "Gerar PDF".
9. Na janela de impressão do navegador, selecione "Salvar como PDF" (ou opção
   equivalente), papel A4 e orientação retrato. Desative os cabeçalhos e rodapés do navegador e mantenha a escala em 100% (padrão). Salve o arquivo no local desejado.

A exportação utiliza window.print() e a folha de estilos de impressão. Por isso,
o PDF é produzido pelo próprio navegador, sem serviço externo. O nome sugerido
para o arquivo deriva do nome do requerente e do título do evento.

6. SALVAMENTO E PRIVACIDADE
---------------------------
- O rascunho atual é salvo automaticamente durante o preenchimento.
- O botão "Salvar solicitação" registra uma cópia no histórico local.
- O histórico mantém as 30 solicitações mais recentes; registros mais antigos
  são descartados automaticamente quando esse limite é ultrapassado.
- O logotipo é guardado separadamente e permanece disponível em novos documentos.
- Os dados ficam no localStorage do navegador e no perfil do usuário/dispositivo.
- Os dados não são enviados para a internet nem sincronizados entre navegadores.
- Limpar os dados do site/navegador pode apagar rascunho, histórico e logotipo.
- localStorage não é um banco de dados criptografado. Não armazene informações
  sigilosas ou dados pessoais desnecessários.

Para transferir os dados para outro dispositivo, será necessário implementar uma
rotina de exportação/importação ou utilizar uma solução de armazenamento central.
Essa funcionalidade não faz parte da versão 1.1.0.

7. ORGANIZAÇÃO DO PROJETO
------------------------
index.html
  Estrutura semântica e componentes da interface.

assets/css/styles.css
  Estilos da aplicação, formulário, histórico e pré-visualização.

assets/css/print.css
  Regras específicas para impressão em papel A4, com tipografia ampliada, quebra automática e proteção contra cortes de campos.

src/app.js
  Ponto de entrada e composição dos módulos.

src/models/request-model.js
  Entidade de requerimento, regras de validação e tipos de mídia.

src/models/storage-repository.js
  Persistência local, versionamento das chaves e tratamento de erros.

src/views/form-view.js
  Leitura e atualização do formulário.

src/views/document-view.js
  Renderização do documento imprimível.

src/views/history-view.js
  Renderização do histórico de solicitações.

src/controllers/request-controller.js
  Coordenação dos eventos, validação, salvamento e exportação.

src/services/logo-service.js
  Validação, leitura e redução do logotipo.

src/services/pdf-exporter.js
  Estratégia de exportação por impressão e fábrica do exportador.

src/utils/event-bus.js
  Implementação do padrão Observer (publicador/assinante).

src/utils/formatters.js
  Formatação de datas, identificadores e nome sugerido do PDF.

tests/request-model.test.js
  Testes unitários da entidade de domínio.

docs/ARCHITECTURE.md
  Resumo das decisões de arquitetura e dos padrões utilizados.

8. ARQUITETURA E PADRÕES
------------------------
- MVC: separação entre Model (regras e dados), View (interface/documento) e
  Controller (coordenação das ações).
- Orientação a Objetos: classes para entidade, repositório, views, serviços e
  controlador.
- Repository Pattern: acesso ao localStorage encapsulado em StorageRepository.
- Observer Pattern: EventBus desacopla eventos do formulário e da pré-visualização.
- Strategy Pattern: PrintPdfExporter encapsula a estratégia de exportação.
- Factory Pattern: ExporterFactory cria a estratégia solicitada.
- Modularização: cada módulo possui uma responsabilidade definida.
- Código limpo: nomes explícitos, validação centralizada e baixo acoplamento.
- IHC e acessibilidade: rótulos, estados visíveis, mensagens, foco em erros,
  layout responsivo e regiões de status acessíveis.

9. TESTES OPCIONAIS
-------------------
Com Node.js 18 ou superior instalado:
1. Abra o terminal na pasta do projeto.
2. Execute: npm test

Os testes verificam regras básicas da entidade RequestModel. A aplicação em si
não depende de Node.js para funcionar no navegador.

10. LIMITAÇÕES CONHECIDAS
------------------------
- A assinatura é um espaço em branco para assinatura manual após a impressão.
  Não há assinatura digital certificada nesta versão.
- A exportação depende da função de impressão do navegador e da opção de salvar
  como PDF oferecida pelo sistema operacional/navegador.
- O logotipo é armazenado como imagem rasterizada com fundo branco para melhorar
  a compatibilidade e a impressão; transparência do arquivo original é removida.
- O limite de 30 solicitações é intencional para reduzir o consumo do localStorage.
- A aplicação não faz protocolo, encaminhamento, aprovação ou agendamento real.

11. PERSONALIZAÇÃO
------------------
- Textos institucionais e campos podem ser editados em index.html.
- Cores, espaçamentos e tipografia ficam em assets/css/styles.css.
- A aparência de impressão fica em assets/css/print.css. Essa folha usa medidas físicas em milímetros e fontes em pontos (pt), permite paginação automática quando o conteúdo ultrapassa uma página e preserva campos e assinatura contra quebras internas.
- Novas opções de mídia devem ser adicionadas ao select em index.html e à lista
  MEDIA_TYPES em src/models/request-model.js.
- A chave de armazenamento inclui a versão v1. Ao alterar o formato dos dados,
  crie uma nova versão de chave e, se necessário, uma rotina de migração.

Desenvolvido para uso interno da Rede Municipal de Educação de Irecê – BA.
