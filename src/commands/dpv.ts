/**
 * DPV command - Sends a pacman emoticon
 */
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const dpv: Command = {
  data: new SlashCommandBuilder()
    .setName('dpv')
    .setDescription('Yukine te responde con un pac-man'),

  async execute(interaction: CommandInteraction) {
    await interaction.reply(':v');
  },
};
