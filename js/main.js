import { initRouter } from './router.js';
import { initDB } from './state/db.js';
import { renderHeader } from './ui/header.js';
import { routes } from './routes.js';

const appEl = document.getElementById('app');

function mountShell(contentEl) {
  const isFullscreen = !!(contentEl.dataset && contentEl.dataset.fullscreen);
  appEl.innerHTML = '';
  if (isFullscreen) {
    // Mount content directly without the screen chrome or header
    appEl.appendChild(contentEl);
    return;
  }
  const shell = document.createElement('div');
  shell.className = 'screen';
  if (!contentEl.dataset || !contentEl.dataset.noHeader) {
    shell.appendChild(renderHeader());
  }
  shell.appendChild(contentEl);
  appEl.appendChild(shell);
}

async function bootstrap() {
  await initDB();
  const router = initRouter(routes, mountShell);
  router.start();
}

bootstrap();


