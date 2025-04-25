/**
 * Chat command - Interact with AI functionality
 */
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';
import { generateAIResponse } from '../services/aiService';

export const chat: Command = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Yukine responde con el poder de la IA')
    .addStringOption((option) =>
      option.setName('mensaje').setDescription('Pregunta cualquier cosa...').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const mensaje = interaction.options.getString('mensaje');

    await interaction.deferReply();

    try {
      const response = await generateAIResponse(mensaje!);

      if (!response.success || !response.result) {
        const errorMessage = response.errors?.[0]?.message || 'Error desconocido en la API';
        console.error('Error in AI response', response);
        await interaction.editReply(`❌ No pude responder tu pregunta. Error: ${errorMessage}`);
        return;
      }

      await interaction.editReply(response.result.response);
    } catch (error) {
      console.error('Error processing the request:', error);
      await interaction.editReply(
        '❌ Error procesando tu solicitud. Por favor, intenta más tarde.'
      );
    }
  },
};
