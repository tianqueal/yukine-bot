/**
 * Avatar command - Shows a user's avatar
 */
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../types';

export const avatar: Command = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Obtiene el avatar de un usuario')
    .addUserOption((option) =>
      option
        .setName('usuario')
        .setDescription('El usuario del que quieres obtener el avatar')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const targetUser = interaction.options.getUser('usuario')!;

      const avatarEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`Avatar de ${targetUser.username}`)
        .setImage(targetUser.displayAvatarURL({ size: 1024 }))
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.reply({ embeds: [avatarEmbed] });
    } catch (error) {
      console.error('Error getting the avatar:', error);
      await interaction.reply('Hubo un error al obtener el avatar del usuario.');
    }
  },
};
