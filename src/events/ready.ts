/**
 * Ready event - Triggered when bot is successfully connected to Discord
 */
import { Client, Events } from 'discord.js';
import { CONFIG } from '../config/constants';

export default (client: Client): void => {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Session started as ${readyClient.user.tag}`);

    // Set bot presence activity
    client.user?.setPresence({
      activities: CONFIG.STATUS.ACTIVITIES,
      status: CONFIG.STATUS.STATUS,
    });
  });
};
