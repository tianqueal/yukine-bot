/**
 * Bot command - Shows bot information
 */
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';
import { CONFIG } from '../config/constants';

export const bot: Command = {
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Obtén información acerca de este Bot'),

  async execute(interaction: CommandInteraction) {
    try {
      const userId = CONFIG.OWNER_ID;
      const author = await interaction.client.users.fetch(userId);

      const embedBot = new EmbedBuilder()
        .setColor(0xccccff)
        .setTitle('Yukine II')
        .setURL('https://example.com')
        .setAuthor({
          name: author.username,
          iconURL: author.displayAvatarURL(),
          url: 'https://example.com',
        })
        .setThumbnail(
          'https://cdn.discordapp.com/attachments/829820463538241606/1219394599420694528/yukinehd-removebg-preview.png?ex=66e40377&is=66e2b1f7&hm=c31cda63be8f1e86867acc08e74dc933d4af18212a0478bcab0ecc0d56927c0a&'
        )
        .addFields({
          name: 'Información del bot',
          value:
            '**Yukine II Bot** creado y programado en TypeScript/Node.js por Liansky.\n\nEl Logotipo y nombre son extraidos de la animación japonesa *<Noragami>*; propiedad y derechos de *<Adachikota>*.\n\nSin reclamaciones de copyright por uso **no comercial**, según la Ley de Derechos de Autor.',
        })
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.reply({ embeds: [embedBot] });
    } catch (error) {
      console.error('Error displaying bot information:', error);
      await interaction.reply('Hubo un error al mostrar la información del bot.');
    }
  },
};
