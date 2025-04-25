/**
 * Interaction event - Handles all interactions (slash commands)
 */
import { Client, Events, Interaction, Collection, MessageFlags } from 'discord.js';
import { Command } from '../types';

export default (client: Client, commands: Collection<string, Command>): void => {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isAutocomplete()) {
      const command = commands.get(interaction.commandName);

      if (!command || !command.autocomplete) return;

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(`Error in the auto-completion of command ${interaction.commandName}:`, error);
      }
      return;
    }

    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);

      if (!command) {
        await interaction.reply({
          content: 'No existe ese comando :(',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing the command ${interaction.commandName}:`, error);
        await interaction.reply({
          content: 'Hubo un error al ejecutar este comando.',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });
};
