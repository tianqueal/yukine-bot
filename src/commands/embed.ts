/**
 * Embed command - Allows users to create and send custom embeds
 */
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ComponentType,
  MessageFlags,
} from 'discord.js';
import { Command } from '../types';

export const embed: Command = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Crea y envía un mensaje embed personalizado a un canal')
    .addChannelOption((option) =>
      option
        .setName('canal')
        .setDescription('Canal donde se enviará el embed')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option.setName('titulo').setDescription('Título del embed').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('descripcion')
        .setDescription('Descripción o contenido principal del embed')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('url').setDescription('URL del embed (opcional)').setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('imagen')
        .setDescription('URL de la imagen principal a mostrar en el embed (opcional)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('thumbnail')
        .setDescription('URL de la imagen pequeña (thumbnail) a mostrar en el embed (opcional)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('color')
        .setDescription('Color del embed en formato hexadecimal (ejemplo: #FF0000 para rojo)')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('footer')
        .setDescription('Texto que aparecerá en el pie del embed (opcional)')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // Get the channel to send the embed
      const channel = interaction.options.getChannel('canal') as TextChannel;

      if (!channel || channel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: 'El canal seleccionado no es válido o no es un canal de texto.',
          flags: MessageFlags.Ephemeral,
        });
      }

      // Get user options
      const title = interaction.options.getString('titulo')!;
      const url = interaction.options.getString('url');
      const description = interaction.options.getString('descripcion')!;
      const imageUrl = interaction.options.getString('imagen');
      const thumbnailUrl = interaction.options.getString('thumbnail');
      const footerText = interaction.options.getString('footer');
      const colorInput = interaction.options.getString('color') || '#CCCCFF'; // Default colour

      let colorValue: number;
      try {
        const colorHex = colorInput.replace('#', '');
        colorValue = parseInt(colorHex, 16);

        if (isNaN(colorValue)) {
          colorValue = 0xccccff;
        }
      } catch (error) {
        colorValue = 0xccccff;
      }

      // Create the initial embed
      const customEmbed = new EmbedBuilder()
        .setColor(colorValue)
        .setTitle(title)
        .setDescription(description)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      if (url) {
        customEmbed.setURL(url);
      }

      if (imageUrl) {
        customEmbed.setImage(imageUrl);
      }

      if (thumbnailUrl) {
        customEmbed.setThumbnail(thumbnailUrl);
      }

      if (footerText) {
        customEmbed.setFooter({
          text: footerText,
          iconURL: interaction.user.displayAvatarURL(),
        });
      }

      // Show an Embed preview and offer options to add Fields
      await interaction.reply({
        content: '**📝 Previsualización del embed:**',
        embeds: [customEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('add_field')
              .setLabel('Añadir campo')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('inline_field')
              .setLabel('Añadir campo (inline)')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('send_embed')
              .setLabel('Enviar embed')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('cancel')
              .setLabel('Cancelar')
              .setStyle(ButtonStyle.Danger)
          ),
        ],
        flags: MessageFlags.Ephemeral,
        withResponse: true,
      });

      // Get the answer after using Reply
      const previewMessage = await interaction.fetchReply();

      // Create a collector for the buttons
      const collector = previewMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 300000, // 5 minutes to interact
      });

      // Handle interactions with buttons
      collector.on('collect', async (i) => {
        // Verify that the person who interacts is the same as the embed
        if (i.user.id !== interaction.user.id) {
          await i.reply({
            content: 'Solo la persona que creó el embed puede modificarlo.',
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        switch (i.customId) {
          case 'add_field':
          case 'inline_field':
            const fieldModal = new ModalBuilder()
              .setCustomId(`field_modal_${i.customId === 'inline_field' ? 'inline' : 'block'}`)
              .setTitle('Añadir campo al embed');

            const fieldNameInput = new TextInputBuilder()
              .setCustomId('field_name')
              .setLabel('Nombre del campo')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Ej: Estado, Nivel, Información')
              .setMaxLength(256)
              .setRequired(true);

            const fieldValueInput = new TextInputBuilder()
              .setCustomId('field_value')
              .setLabel('Valor del campo')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Contenido del campo')
              .setMaxLength(1024)
              .setRequired(true);

            // Add the inputs to modal
            fieldModal.addComponents(
              new ActionRowBuilder<TextInputBuilder>().addComponents(fieldNameInput),
              new ActionRowBuilder<TextInputBuilder>().addComponents(fieldValueInput)
            );

            // Show the modal
            await i.showModal(fieldModal);

            // Wait for the modal response
            try {
              const modalSubmit = await i.awaitModalSubmit({
                time: 120000, // 2 minutes to respond to Modal
                filter: (m) =>
                  m.customId.startsWith('field_modal_') && m.user.id === interaction.user.id,
              });

              // Get the modal values
              const fieldName = modalSubmit.fields.getTextInputValue('field_name');
              const fieldValue = modalSubmit.fields.getTextInputValue('field_value');
              const isInline = modalSubmit.customId === 'field_modal_inline';

              // Add the Field to Embed
              customEmbed.addFields({
                name: fieldName,
                value: fieldValue,
                inline: isInline,
              });

              await modalSubmit.deferUpdate();
              await interaction.editReply({
                content: '**📝 Previsualización del embed (campo añadido):**',
                embeds: [customEmbed],
                components: [
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setCustomId('add_field')
                      .setLabel('Añadir campo')
                      .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                      .setCustomId('inline_field')
                      .setLabel('Añadir campo (inline)')
                      .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                      .setCustomId('send_embed')
                      .setLabel('Enviar embed')
                      .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                      .setCustomId('cancel')
                      .setLabel('Cancelar')
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            } catch (error) {
              console.error('Error al esperar la respuesta del modal:', error);
            }
            break;

          case 'send_embed':
            await channel.send({ embeds: [customEmbed] });

            await i.update({
              content: `✅ El embed ha sido enviado correctamente al canal ${channel}.`,
              embeds: [customEmbed],
              components: [],
            });

            collector.stop();
            break;

          case 'cancel':
            await i.update({
              content: '❌ El proceso de creación del embed ha sido cancelado.',
              embeds: [],
              components: [],
            });
            collector.stop();
            break;
        }
      });

      collector.on('end', async (_, reason) => {
        if (reason === 'time') {
          try {
            await interaction.editReply({
              content: '⏰ El tiempo para editar el embed ha expirado.',
              components: [],
            });
          } catch (error) {
            console.error('Error updating message after Timeout:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error creating or sending custom embed:', error);
      await interaction.reply({
        content:
          'Hubo un error al crear o enviar el embed personalizado. Verifica los datos ingresados.',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
