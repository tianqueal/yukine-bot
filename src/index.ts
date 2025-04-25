/**
 * Yukine II Bot - Discord bot with AI capabilities
 * Main entry point
 */
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { Client, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import fs from 'fs';
import { CONFIG } from './config/constants';
import { Command } from './types';

// Setup Express server for web interface
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
  console.log(`Web server started in port ${PORT}`);
});

// Create Discord client
const client = new Client({ intents: CONFIG.INTENTS });

// Command collection
const commands = new Collection<string, Command>();

// Load commands
const commandFiles = fs
  .readdirSync(path.join(__dirname, 'commands'))
  .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of commandFiles) {
  const commandModule = require(path.join(__dirname, 'commands', file));
  // Get the exported command from the file
  const command = Object.values(commandModule)[0] as Command;
  if (command?.data?.name) {
    commands.set(command.data.name, command);
  }
}

// Load events
const eventFiles = fs
  .readdirSync(path.join(__dirname, 'events'))
  .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of eventFiles) {
  const eventModule = require(path.join(__dirname, 'events', file));
  const event = eventModule.default;

  // If the event is interaction creation, pass both client and commands
  if (file === 'interactionCreate.js' || file === 'interactionCreate.ts') {
    event(client, commands);
  } else {
    event(client);
  }
}

// Register slash commands with Discord API
const rest = new REST({ version: '10' }).setToken(CONFIG.TOKEN);

(async () => {
  try {
    console.log('Registering Slash Commands...');

    const commandData = Array.from(commands.values()).map((cmd) => cmd.data.toJSON());

    await rest.put(Routes.applicationCommands(CONFIG.CLIENT_ID), {
      body: commandData,
    });

    console.log('Slash commands correctly registered!');
  } catch (error) {
    console.error('Error when registering Slash Commands:', error);
  }
})();

// Login to Discord
client.login(CONFIG.TOKEN);
