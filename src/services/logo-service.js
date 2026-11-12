/** Valida e reduz imagens antes de armazená-las no localStorage. */
export class LogoService {
  constructor(maxFileSize = 8 * 1024 * 1024, maxDimension = 600) {
    this.maxFileSize = maxFileSize;
    this.maxDimension = maxDimension;
  }

  async process(file) {
    if (!file) throw new Error('Selecione um arquivo de imagem.');
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) throw new Error('Formato não suportado. Use PNG, JPG, WEBP ou SVG.');
    if (file.size > this.maxFileSize) throw new Error('O arquivo excede o limite de 8 MB.');

    const source = await this.readAsDataUrl(file);
    const image = await this.loadImage(source);
    const originalWidth = image.naturalWidth || image.width;
    const originalHeight = image.naturalHeight || image.height;
    if (!originalWidth || !originalHeight) throw new Error('Não foi possível interpretar a imagem selecionada.');

    const scale = Math.min(1, this.maxDimension / Math.max(originalWidth, originalHeight));
    const width = Math.max(1, Math.round(originalWidth * scale));
    const height = Math.max(1, Math.round(originalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Seu navegador não conseguiu processar a imagem.');

    // O fundo branco mantém a legibilidade em documentos impressos.
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.88);
  }

  readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));
      reader.readAsDataURL(file);
    });
  }

  loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      image.src = source;
    });
  }
}
