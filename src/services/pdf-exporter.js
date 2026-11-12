import { createSuggestedFilename } from '../utils/formatters.js';

/** Strategy: exporta o documento por meio do mecanismo nativo de impressão do browser. */
export class PrintPdfExporter {
  export(request) {
    const previousTitle = document.title;
    document.title = createSuggestedFilename(request.requesterName, request.eventTitle);

    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    window.addEventListener('afterprint', restoreTitle, { once: true });

    // A janela de impressão permite selecionar "Salvar como PDF" sem bibliotecas externas.
    window.print();
    window.setTimeout(restoreTitle, 30000);
  }
}

/** Factory: centraliza a criação da estratégia de exportação. */
export class ExporterFactory {
  static create(format = 'pdf') {
    if (format === 'pdf') return new PrintPdfExporter();
    throw new Error(`Formato de exportação não suportado: ${format}`);
  }
}
