/**
 * Time command - Shows local time for a timezone
 */
import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  AutocompleteInteraction,
} from 'discord.js';
import { Command } from '../types';

// Get all natively available time zones
// This function uses Intl.supportedValuesOf if available
// or use a reduced list of common areas as a fallback
function getAvailableTimezones(): string[] {
  try {
    // Use native API if available
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
    throw new Error('Intl.supportedValuesOf not supported');
  } catch (error) {
    console.warn('Intl.supportedValuesOf no disponible, usando lista de fallback', error);
    // Reduced fallback list for environments where Intl.supportedValuesOf is not available
    return [
      // Europa
      'Europe/Madrid',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      // America
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'America/Mexico_City',
      'America/Sao_Paulo',
      'America/Santiago',
      'America/Bogota',
      'America/Lima',
      'America/Buenos_Aires',
      // Asia
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Dubai',
      'Asia/Singapore',
      // Oceania
      'Australia/Sydney',
      'Pacific/Auckland',
      // Africa
      'Africa/Cairo',
      'Africa/Johannesburg',
    ];
  }
}

// Cache the list of time zones so as not to regenerate it at each autocompletion
const TIMEZONES = getAvailableTimezones();

export const hora: Command = {
  data: new SlashCommandBuilder()
    .setName('hora')
    .setDescription('Obtiene la hora local de una zona horaria específica')
    .addStringOption((option) =>
      option
        .setName('zona')
        .setDescription('Continente/Ciudad')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const timezone = interaction.options.getString('zona')!;

      // Check the time zone format
      if (!/^[A-Za-z]+\/[A-Za-z_]+$/.test(timezone)) {
        return interaction.reply({
          content:
            'Formato incorrecto. Usa: Continente/Ciudad (ej: Europe/Madrid, America/New_York)',
          flags: MessageFlags.Ephemeral,
        });
      }

      const formatter = new Intl.DateTimeFormat('es-ES', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZoneName: 'short',
      });

      const localTime = formatter.format(new Date());

      await interaction.reply(`🕒 Hora local en **${timezone}**: ${localTime}`);
    } catch (error) {
      console.error('Error obtaining local time:', error);
      await interaction.reply({
        content:
          'Zona horaria no válida. Usa: Continente/Ciudad (ej: Europe/Madrid, America/New_York)',
        flags: MessageFlags.Ephemeral,
      });
    }
  },

  /**
   * Auto-completion for time zones
   */
  async autocomplete(interaction: AutocompleteInteraction) {
    try {
      const focusedValue = interaction.options.getFocused().toLowerCase();

      // Filter time zones based on user input
      const filtered = TIMEZONES.filter((timezone) => timezone.toLowerCase().includes(focusedValue))
        .sort((a, b) => {
          // Sort first by continent, then by full name
          const continentA = a.split('/')[0];
          const continentB = b.split('/')[0];
          if (continentA !== continentB) {
            return continentA.localeCompare(continentB);
          }
          return a.localeCompare(b);
        })
        .slice(0, 25);

      // Display time zones with their current time as description
      const options = filtered.map((timezone) => {
        try {
          // Get current time in this time zone (simplified format)
          const currentTime = new Intl.DateTimeFormat('es-ES', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date());

          return {
            name: `${timezone} (${currentTime})`,
            value: timezone,
          };
        } catch (e) {
          // If there is an error with a time zone
          return {
            name: timezone,
            value: timezone,
          };
        }
      });

      await interaction.respond(options);
    } catch (error) {
      console.error('Error en autocompletado de zona horaria:', error);
      // In case of error, provide default options
      await interaction.respond([
        { name: 'Europe/Madrid', value: 'Europe/Madrid' },
        { name: 'America/New_York', value: 'America/New_York' },
        { name: 'Asia/Tokyo', value: 'Asia/Tokyo' },
      ]);
    }
  },
};
