/**
 * Ping command - Check bot's latency
 */
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Obtén la latencia del bot'),

  async execute(interaction: CommandInteraction) {
    await interaction.reply(`Pong! Latencia: ${interaction.client.ws.ping}ms`);
  },
};
