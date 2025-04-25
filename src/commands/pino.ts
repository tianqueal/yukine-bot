/**
 * Pino command - Surprises other users
 */
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export const pino: Command = {
  data: new SlashCommandBuilder().setName('pino').setDescription('Sorprende a los demás'),

  async execute(interaction: CommandInteraction) {
    const { username } = interaction.user;
    const measurement = Math.floor(Math.random() * (21 - 7 + 1)) + 7;

    const customEmbed = new EmbedBuilder().setTitle(
      `La berenjena de ${username} mide ${measurement} centímetros`
    );

    await interaction.reply({ embeds: [customEmbed] });
  },
};
