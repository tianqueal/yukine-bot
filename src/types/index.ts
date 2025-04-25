import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
} from 'discord.js';

/**
 * Image types supported by the bot
 */
export interface ImageType {
  name: string;
  value: string;
}

/**
 * Command interface for all bot commands
 * Discord.js uses a type system that changes according to the methods that are chained
 * This definition accepts any result of Slashcommandbuilder's Builder Pattern
 */
export interface Command {
  data:
    | SlashCommandBuilder
    | ReturnType<SlashCommandBuilder['addStringOption']>
    | ReturnType<SlashCommandBuilder['addUserOption']>
    | ReturnType<SlashCommandBuilder['addIntegerOption']>
    | ReturnType<SlashCommandBuilder['addBooleanOption']>
    | ReturnType<SlashCommandBuilder['addChannelOption']>
    | ReturnType<SlashCommandBuilder['addRoleOption']>
    | ReturnType<SlashCommandBuilder['addAttachmentOption']>
    | ReturnType<SlashCommandBuilder['addMentionableOption']>
    | ReturnType<SlashCommandBuilder['addNumberOption']>;
  execute: (
    interaction: ChatInputCommandInteraction
  ) => Promise<void | InteractionResponse<boolean> | undefined>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

/**
 * AI response format from Cloudflare API
 */
export interface AIResponse {
  result: {
    response: string;
  };
  success: boolean;
  errors: Array<{ code: number; message: string }>;
}

/**
 * Cloudflare AI API Input Types
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

interface CommonModelParams {
  response_format?: {
    type: 'json_object' | 'json_schema';
    json_schema?: Record<string, unknown>; // Not using 'any' to avoid type issues
  };
  raw?: boolean;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  seed?: number;
  repetition_penalty?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface PromptInput extends CommonModelParams {
  prompt: string;
  lora?: string;
}

export interface MessagesInput extends CommonModelParams {
  messages: Array<AIMessage>;
  functions?: Array<{
    name: string;
    code: string;
  }>;
  tools?: Array<{
    name?: string;
    description?: string;
    parameters?: {
      type: string;
      required: Array<string>;
      properties: Record<
        string,
        {
          type: string;
          description: string;
        }
      >;
    };
    type?: string;
    function?: {
      name: string;
      description: string;
      parameters: {
        type: string;
        required: Array<string>;
        properties: Record<
          string,
          {
            type: string;
            description: string;
          }
        >;
      };
    };
  }>;
}

export type CloudflareAIInput = PromptInput | MessagesInput;
