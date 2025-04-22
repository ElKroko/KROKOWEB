// src/constants/systemMessages.ts
export const routeMessages: Record<string, string> = {
    '/':       'Hola',
    '/art':    'Puedes ver mis obras en IG tambien!',
    '/programming': '01100011',
    '/trading':     'stonks',
    '/gallery':     'Aquí puedes explorar mi galería de creaciones.',
    '/about':       '¡Hola! Aquí puedes conocer más sobre mí y mi trabajo.',
    '/contact':     '¿Quieres contactarme? Puedes hacerlo desde aquí.',
    '/music':       'Disfruta de mi música.',
    '/create':      'Experimenta con mis herramientas',
    '/me':          'Aquí encontrarás información personal sobre mí.',
    // …añade o modifica rutas sin tocar el componente
  };

export function getRouteMessage(pathname: string, defaultMessage = '¡Bienvenido a mi sitio web!') {
    // Busca la ruta más específica que coincida
    for (const [path, msg] of Object.entries(routeMessages)) {
      if (pathname === path || pathname.startsWith(path + '/')) {
        return msg;
      }
    }
    return defaultMessage;
  }
  