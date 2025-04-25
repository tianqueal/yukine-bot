/**
 * Image command - Get an image from URL
 */
import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';
import { IMAGE_TYPES } from '../config/constants';

export const imagen: Command = {
  data: new SlashCommandBuilder()
    .setName('imagen')
    .setDescription('Obtiene la imagen de una URL')
    .addStringOption((option) =>
      option.setName('url').setDescription('URL de la imagen').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('tipo')
        .setDescription('Tipo de imagen')
        .setRequired(true)
        .addChoices(...IMAGE_TYPES.map((type) => ({ name: type.name, value: type.value })))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const imageUrl = interaction.options.getString('url')!;
    const imageType = interaction.options.getString('tipo')!;

    await interaction.deferReply();

    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error('No se pudo obtener la imagen');
      }

      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const attachment = new AttachmentBuilder(imageBuffer, { name: `image.${imageType}` });

      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error('Error getting the image:', error);
      await interaction.editReply('Hubo un error al procesar la imagen.');
    }
  },
};
