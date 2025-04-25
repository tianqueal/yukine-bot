/**
 * Tag command - Mentions the user
 */
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const tag: Command = {
  data: new SlashCommandBuilder().setName('tag').setDescription('Yukine te menciona'),

  async execute(interaction: CommandInteraction) {
    await interaction.reply(`¡Hola, ${interaction.user}!`);
  },
};
