/**
 * AI service for Yukine bot
 * Handles interactions with Cloudflare AI API
 */
import https from 'https';
import { CONFIG, AI_PROMPTS, AI_PARAMETERS } from '../config/constants';
import { AIMessage, AIResponse, CloudflareAIInput, MessagesInput } from '../types';
import { getErrorMessage } from '../utils/errorHandling';

/**
 * Run AI model with given input
 * @param model - AI model to use
 * @param input - Input data for the model
 * @returns Promise with AI response
 */
export async function runAI(model: string, input: CloudflareAIInput): Promise<AIResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4/accounts/${CONFIG.CF_ACCOUNT_ID}/ai/run/${model}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.CF_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    // Log information for debugging (but mask the full API key)
    console.log(`Making request to AI model: ${model}`);
    console.log(`Using account ID: ${CONFIG.CF_ACCOUNT_ID}`);
    console.log(
      `API Key present: ${Boolean(CONFIG.CF_API_KEY)} (${CONFIG.CF_API_KEY.substring(0, 4)}...)`
    );

    const req = https.request(options, (res) => {
      let data = '';

      // Log status code for debugging
      console.log(`API response status: ${res.statusCode}`);

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);

          if (!parsedData.success || !parsedData.result) {
            console.error('Error in the AI response:', JSON.stringify(parsedData, null, 2));
            reject(new Error(parsedData.errors?.[0]?.message || 'Error desconocido en la API'));
            return;
          }

          resolve(parsedData as AIResponse);
        } catch (error) {
          console.error('Error parsing AI response:', error, 'Datos recibidos:', data);
          reject(new Error('Error al procesar la respuesta de la API'));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error in the AI application:', error);
      reject(error);
    });

    req.write(JSON.stringify(input));
    req.end();
  });
}

/**
 * Run AI chat with given message
 * @param msg - User message to process
 * @returns Promise with AI response
 */
export async function generateAIResponse(msg: string): Promise<AIResponse> {
  try {
    const messages: Array<AIMessage> = [
      {
        role: 'system',
        content: AI_PROMPTS.YUKINE_ASSISTANT,
      },
      {
        role: 'user',
        content: msg,
      },
    ];

    const input: MessagesInput = {
      messages,
      ...AI_PARAMETERS.DEFAULT,
    };

    const result = await runAI('@cf/meta/llama-3-8b-instruct', input);
    return result;
  } catch (error: unknown) {
    console.error('Error when running the AI model:', error);

    const errorMessage = getErrorMessage(error);

    const errorResponse: AIResponse = {
      result: {
        response: `Lo siento, no pude procesar tu solicitud. Error: ${errorMessage}`,
      },
      success: false,
      errors: [{ code: 500, message: errorMessage }],
    };
    return errorResponse;
  }
}
