import { getAuth } from './state/session.js';

export function initRouter(routes, mount) {
  const routeMap = Object.fromEntries(routes.map(r => [r.path, r]));

  function resolve(hash) {
    const clean = (hash || '#/').replace(/^#/, '');
    const path = clean.startsWith('/') ? clean : '/' + clean;
    return path;
  }

  function navigate(to) {
    if (location.hash !== '#' + to) {
      location.hash = to;
    } else {
      render();
    }
  }

  async function render() {
    let path = resolve(location.hash);

    const auth = getAuth();
    if (!auth.user && path !== '/login') path = '/login';
    if (auth.user && !auth.user.primaryClass && path !== '/class' && path !== '/login') path = '/class';

    const route = routeMap[path] || routeMap['/'];
    const content = await route.render({ navigate });
    mount(content);
  }

  function start() {
    addEventListener('hashchange', render);
    render();
  }

  return { start, navigate };
}


