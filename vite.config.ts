import {defineConfig, Plugin} from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin personalizado para modificar el contenido de index.html
const modifyHtmlPlugin = (): Plugin => {
  return {
    name: 'modify-html-static',
    closeBundle() {
      // Ruta del index.html generado
      const indexPath = path.resolve(__dirname, 'dist/index.html');
      let html = fs.readFileSync(indexPath, 'utf-8');

      // Modifica las rutas de los recursos
      html = html
          .replace(/href="\/assets/g, 'href="/static/assets')
          .replace(/src="\/assets/g, 'src="/static/assets')
          .replace(/href="\/simbolo_logo/g, 'href="/static/simbolo_logo');

      // Guarda el archivo modificado
      fs.writeFileSync(indexPath, html);
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), modifyHtmlPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  base: '/',
})
