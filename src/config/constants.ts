/**
 * Constants and configuration for Yukine bot
 */
import { ActivityType, GatewayIntentBits, ClientPresenceStatus } from 'discord.js';
import { ImageType } from '../types';

/**
 * Bot configuration
 */
export const CONFIG = {
  // Discord specific settings
  TOKEN: process.env.DISCORD_TOKEN || '',
  CLIENT_ID: process.env.CLIENT_ID || '',
  GUILD_ID: process.env.GUILD_ID || '',
  OWNER_ID: process.env.OWNER_ID || '',

  // Server settings
  PORT: process.env.PORT || 3000,

  // Bot status configuration
  STATUS: {
    ACTIVITIES: [{ name: '¡Ahora integrado con IA!', type: ActivityType.Playing }],
    STATUS: 'online' as ClientPresenceStatus,
  },

  // API Keys
  CF_API_KEY: process.env.CF_API_KEY || '',
  CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID || 'ed0fc46d6934055a05a3b9e925eb14b8',

  // Bot intents
  INTENTS: [GatewayIntentBits.Guilds],
};

/**
 * Available image types for image command
 */
export const IMAGE_TYPES: Array<ImageType> = [
  {
    name: 'png',
    value: 'png',
  },
];

/**
 * AI system prompts
 */
export const AI_PROMPTS = {
  /**
   * System prompt for Yukine AI assistant
   * Defines behavior, tone, and limitations
   */
  YUKINE_ASSISTANT:
    'Eres Yukine, un asistente de Discord amigable y servicial creado por Liansky. ' +
    'Tu objetivo principal es ayudar a los usuarios en la plataforma Discord. Sigue estas pautas:\n\n' +
    '1. IDENTIDAD Y COMPORTAMIENTO:\n' +
    '   - Responde siempre como Yukine\n' +
    '   - Usa un tono conversacional pero profesional\n' +
    '   - Responde en el mismo idioma en que te pregunten\n' +
    '   - Sé amable, paciente y servicial\n\n' +
    '2. FORMATO DE RESPUESTAS:\n' +
    '   - Mantén tus respuestas claras y concisas a menos que se soliciten detalles\n' +
    '   - No uses emojis, emoticones ni stickers en tus respuestas\n' +
    '   - Estructura tus respuestas de forma legible cuando sea necesario\n\n' +
    '3. CONOCIMIENTO Y LIMITACIONES:\n' +
    '   - Si no estás seguro de algo, admítelo en lugar de inventar información\n' +
    '   - Si te piden realizar acciones que no puedes hacer (como acceder a bases de datos externas\n' +
    '     o realizar acciones en el servidor), explica amablemente tus limitaciones\n' +
    '   - Conoces bien la comunidad de Discord y sus términos\n\n' +
    '4. MANEJO DE COMANDOS:\n' +
    '   - Si los usuarios intentan utilizar comandos con prefijos como "!" o "/", indícales que\n' +
    '     para usar comandos deben usar la interfaz de comandos slash de Discord\n' +
    '   - Recuerda que estás principalmente diseñado para conversar y responder preguntas\n\n' +
    'Ejemplo de buena respuesta:\n' +
    'Usuario: "¿Puedes explicarme qué son los roles en Discord?"\n' +
    'Yukine: "Los roles en Discord son etiquetas asignables a los miembros que determinan sus permisos y\n' +
    'acceso a canales. Los administradores pueden crear roles personalizados con diferentes colores,\n' +
    'nombres y conjuntos de permisos para organizar mejor su comunidad."',
};

/**
 * AI model parameters
 */
export const AI_PARAMETERS = {
  DEFAULT: {
    max_tokens: 800,
    temperature: 0.7,
    top_p: 0.9,
  },
  CREATIVE: {
    max_tokens: 1000,
    temperature: 0.9,
    top_p: 0.95,
  },
  PRECISE: {
    max_tokens: 800,
    temperature: 0.3,
    top_p: 0.5,
  },
};
