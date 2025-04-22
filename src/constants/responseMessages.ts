// src/constants/responseMessages.ts

/**
 * Mapeo de respuestas automáticas según palabras clave en el mensaje del usuario.
 */
const responseMap: { [key: string]: string } = {
    hola: 'Ola',
    hi:   'Saluton',
    hey:  'Hey, ¿qué tal?',
    saludos: '¡Hola! ¿En qué puedo ayudarte hoy?',
    gracias: '¡No hay de qué! Estoy aquí para ayudarte.',
    thanks:  '¡No hay de qué! Estoy aquí para ayudarte.',
    ayuda:   'Y quien me ayuda a mi?',
    help:    'Y quien me ayuda a mi?'
  };
  
  /**
   * Devuelve la respuesta adecuada según el texto de entrada.
   * Si no coincide ninguna palabra clave, retorna un mensaje genérico.
   */
  export function getResponseMessage(input: string): string {
    const lower = input.toLowerCase();
    for (const key of Object.keys(responseMap)) {
      if (lower.includes(key)) {
        return responseMap[key];
      }
    }
    return 'Error 0xDED: ah?';
  }
  