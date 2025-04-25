/**
 * Say command - Makes the bot repeat a message
 */
import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { Command } from '../types';

export const decir: Command = {
  data: new SlashCommandBuilder()
    .setName('decir')
    .setDescription('Yukine repite lo que le digas')
    .addStringOption((option) =>
      option.setName('mensaje').setDescription('Lo que quieres que Yukine repita').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const message = interaction.options.getString('mensaje')!;

      // Responder de forma efímera para que no se muestre que el usuario usó el comando
      await interaction.reply({ content: 'Mensaje enviado', flags: MessageFlags.Ephemeral });

      // Enviar el mensaje en el canal
      if (interaction.channel && interaction.channel instanceof TextChannel) {
        await interaction.channel.send(message);
      }
    } catch (error) {
      console.error('Error sending the message:', error);
      await interaction.reply({
        content: 'Hubo un error al enviar el mensaje.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
