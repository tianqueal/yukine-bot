/**
 * Dice command - Roll a dice with random number between 1-6
 */
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const dado: Command = {
  data: new SlashCommandBuilder()
    .setName('dado')
    .setDescription('Se muestra un número aleatorio entre 1 y 6'),

  async execute(interaction: CommandInteraction) {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(`🎲 El dado ha caído en: **${randomNumber}**`);
  },
};
