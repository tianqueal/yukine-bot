# Yukine Bot

<img width="970" alt="image" src="https://github.com/user-attachments/assets/4e879ef8-7114-48ba-b5df-8ac71084ea69">

Bot de Discord construido con TypeScript y Discord.js v14.

## Historia y Contexto

Este cliente de la API de Discord es uno de los primeros proyectos personales hechos originalmente en JavaScript. La primera versión fue desarrollada en 2020, durante la época de confinamiento, para una comunidad de amigos que sigue creciendo actualmente.

Discord ha ido cambiando sus políticas con respecto a las funciones y permisos que puede tener un bot en la plataforma, por lo que muchas de las funciones anteriores (recuperación de mensajes borrados, control de usuarios, etc.) no pudieron ser trasladadas a nuevas actualizaciones.

Esta versión es una refactorización completa del bot original, actualizada a las últimas versiones de Discord.js y migrada a TypeScript para mejorar su mantenibilidad y escalabilidad.

## Características

- Sistema modular de comandos con slash commands
- Integración con IA (Cloudflare Workers AI)
- Estructura de código moderna y mantenible
- Completamente tipado con TypeScript
- Soporte para despliegue con Docker

## Requisitos

- Node.js v16.9.0 o superior
- npm v8.0.0 o superior
- Token de bot de Discord
- API de Meta Llama3 (a través de Cloudflare Workers AI)

## Instalación

1. Clona este repositorio

```bash
git clone https://github.com/tianqueal/yukine-bot.git
cd yukine-bot
```

2. Instala las dependencias

```bash
npm install
```

3. Configura las variables de entorno
   - Copia el archivo `.env.example` a `.env`
   - Completa las variables requeridas:
     - `DISCORD_TOKEN`: Token de tu bot de Discord
     - `CLIENT_ID`: ID de cliente de tu aplicación de Discord
     - `GUILD_ID`: ID del servidor de Discord para comandos
     - `OWNER_ID`: Tu ID de usuario en Discord
     - `CF_API_KEY`: Key de API de Cloudflare (para características de IA)
     - `CF_ACCOUNT_ID`: ID de cuenta de Cloudflare

## Desarrollo

Para ejecutar el bot en modo desarrollo con recarga automática:

```bash
npm run dev
```

## Compilación

Para compilar el código TypeScript a JavaScript:

```bash
npm run build
```

## Ejecución en producción

Después de compilar, puedes ejecutar el bot con:

```bash
npm start
```

## Estructura del Proyecto

```
yukine-bot/
├── public/             # Archivos estáticos
├── src/
│   ├── commands/       # Comandos individuales del bot
│   ├── config/         # Archivos de configuración
│   ├── events/         # Manejadores de eventos de Discord
│   ├── services/       # Servicios externos (API, etc.)
│   ├── types/          # Definiciones de tipos TypeScript
│   ├── utils/          # Utilidades y funciones helper
│   └── index.ts        # Punto de entrada principal
├── .env                # Variables de entorno (no en git)
├── .env.example        # Plantilla de variables de entorno
├── tsconfig.json       # Configuración de TypeScript
├── package.json        # Dependencias y scripts
└── README.md           # Documentación
```

## Agregar un Nuevo Comando

1. Crea un nuevo archivo en `src/commands/`
2. Usa la siguiente plantilla:

```typescript
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const nombreComando: Command = {
  data: new SlashCommandBuilder()
    .setName('nombre-comando')
    .setDescription('Descripción del comando'),

  async execute(interaction: CommandInteraction) {
    // Implementación del comando
    await interaction.reply('¡Hola mundo!');
  },
};
```

## Docker

Para ejecutar el bot usando Docker:

```bash
docker-compose up -d
```

## Licencia

MIT License
