/**
 * Greeting command - Simple hello from the bot
 */
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const saludo: Command = {
  data: new SlashCommandBuilder().setName('saludo').setDescription('Saluda al bot'),

  async execute(interaction: CommandInteraction) {
    await interaction.reply('¡Hola!');
  },
};
