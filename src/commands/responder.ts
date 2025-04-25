/**
 * Reply command - Makes the bot reply to a specific message
 */
import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { Command } from '../types';

export const responder: Command = {
  data: new SlashCommandBuilder()
    .setName('responder')
    .setDescription('Responde a un mensaje con un mensaje personalizado')
    .addStringOption((option) =>
      option
        .setName('identificador')
        .setDescription('ID del mensaje correspondiente')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('mensaje')
        .setDescription('El contenido del mensaje que responderá Yukine')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('canal')
        .setDescription('ID del canal correspondiente (si no se asigna, será el canal actual)')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const messageId = interaction.options.getString('identificador')!;
      const replyContent = interaction.options.getString('mensaje')!;
      const channelId = interaction.options.getString('canal') || interaction.channelId;

      const channel = await interaction.client.channels.fetch(channelId);

      if (!channel || !(channel instanceof TextChannel)) {
        return interaction.reply({
          content: 'No se encontró el canal o no es un canal de texto válido.',
          flags: MessageFlags.Ephemeral,
        });
      }

      try {
        const targetMessage = await channel.messages.fetch(messageId);

        await targetMessage.reply(replyContent);

        await interaction.reply({
          content: '¡Mensaje respondido correctamente!',
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        console.error('Error getting the message:', error);
        await interaction.reply({
          content: 'No se pudo encontrar el mensaje. Verifica el ID del mensaje.',
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      console.error('Error replying to the message:', error);
      await interaction.reply({
        content: 'Hubo un error al responder el mensaje.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
