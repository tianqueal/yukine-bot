require("dotenv").config()
const express = require("express")

const app = express()

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor iniciado")
})

const TOKEN = process.env["DISCORD_TOKEN"]
const {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
  AttachmentBuilder,
} = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

const clientId = process.env["CLIENT_ID"]
const guildId = process.env["GUILD_ID"]

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (c) => {
  console.log(`¡Listo! Sesión iniciada como ${c.user.tag}`)
  client.user.setPresence({
    activities: [
      { name: `¡Ahora integrado con IA!`, type: ActivityType.Playing },
    ],
    status: "online",
  })
})

const commands = [
  {
    name: "saludo",
    description: "Saluda al bot",
  },
  {
    name: "ping",
    description: "Obtén la latencia del bot",
  },
  {
    name: "tag",
    description: "Yukine te menciona",
  },
  {
    name: "dpv",
    description: "Yukine envía un pac-man",
  },
  {
    name: "bot",
    description: "Obten información acerca de este Bot",
  },
  {
    name: "dado",
    description: "Se muestra un número aleatorio entre 1 y 6",
  },
  {
    name: "pino",
    description: "Sorprende a los demás",
  },
  {
    name: "chat",
    description: "Yukine responde con el poder de la IA",
    options: [
      {
        name: "mensaje",
        description: "Pregunta cualquier cosa...",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "responder",
    description: "Responde a un mensaje con un mensaje personalizado",
    options: [
      {
        name: "identificador",
        description: "ID del mensaje correspondiente",
        type: 3,
        required: true,
      },
      {
        name: "mensaje",
        description: "El contenido del mensaje que responderá Yukine",
        type: 3,
        required: true,
      },
      {
        name: "canal",
        description:
          "ID del canal correspondiente (si no se asigna, será el canal actual)",
        type: 3,
      },
    ],
  },
  {
    name: "hora",
    description: "Obtiene la hora local de una zona horaria específica",
    options: [
      {
        name: "zona",
        description: "Contienente/Ciudad",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "avatar",
    description: "Obtiene el avatar de un usuario",
    options: [
      {
        name: "usuario",
        type: 6,
        description: "El usuario del que quieres obtener el avatar",
        required: true,
      },
    ],
  },
  {
    name: "decir",
    description: "Yukine repite lo que le digas",
    options: [
      {
        name: "mensaje",
        description: "Lo que quieres que Yukine repita",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "imagen",
    description: "Obtiene la imagen de una URL",
    options: [
      {
        name: "url",
        description: "URL de la imagen",
        type: 3,
        required: true,
      },
    ],
  }
]

const rest = new REST({ version: "9" }).setToken(TOKEN)

;(async () => {
  try {
    console.log("Registrando comandos...")

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    })

    console.log("Comandos registrados correctamente.")
  } catch (error) {
    console.error(error)
  }
})()

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return
  const { commandName } = interaction

  switch (commandName) {
    case "saludo":
      await interaction.reply("¡Hola!")
      break
    case "ping":
      await interaction.reply(`Pong! Latencia: ${client.ws.ping}ms`)
      break
    case "tag":
      await interaction.reply(`${interaction.user}`)
      break
    case "dpv":
      await interaction.reply(`:v`)
      break
    case "bot":
      const userId = process.env["OWNER_ID"]
      const author = await client.users.fetch(userId)
      const embedBot = {
        color: 0xccccff,
        title: "Yukine II",
        url: "https://example.com",
        author: {
          name: author.username,
          icon_url: author.displayAvatarURL(),
          url: "https://example.com",
        },
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/829820463538241606/1219394599420694528/yukinehd-removebg-preview.png?ex=66e40377&is=66e2b1f7&hm=c31cda63be8f1e86867acc08e74dc933d4af18212a0478bcab0ecc0d56927c0a&",
        },
        fields: [
          {
            name: "Información del bot",
            value:
              "**Yukine II Bot** creado y programado en JavaScript/Node.js por Liansky y.\n\nEl Logotipo y nombre son extraidos de la animación japonesa *<Noragami>*; propiedad y derechos de *<Adachikota>*.\n\nSin reclamaciones de copyright por uso **no comercial**, según la Ley de Derechos de Autor.",
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Solicitado por " + interaction.user.username,
          icon_url: interaction.user.displayAvatarURL(),
        },
      }

      await interaction.reply({ embeds: [embedBot] })
      break
    case "dado":
      const embedDado = {
        title: `${
          interaction.user.username
        } ha lanzado un dado y ha sacado un ${Math.floor(
          Math.random() * (6 + 1)
        )}`,
      }
      await interaction.reply({ embeds: [embedDado] })
      break
    case "pino":
      const embedPino = {
        title: `La berenjena de ${interaction.user.username} mide ${Math.floor(
          Math.random() * (20 + 1)
        )} centímetros`,
      }
      await interaction.reply({ embeds: [embedPino] })
      break

    case "chat":
      const https = require("https")
      const res = require("express/lib/response")

      async function runAI(model, input) {
        return new Promise((resolve, reject) => {
          const options = {
            hostname: "api.cloudflare.com",
            port: 443,
            path: `/client/v4/accounts/ed0fc46d6934055a05a3b9e925eb14b8/ai/run/${model}`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env["CF_API_TOKEN"]}`,
              "Content-Type": "application/json",
            },
          }

          const req = https.request(options, (res) => {
            let data = ""

            res.on("data", (chunk) => {
              data += chunk
            })

            res.on("end", () => {
              resolve(JSON.parse(data))
            })
          })

          req.on("error", (error) => {
            console.error("Error en la solicitud AI:", error)
            reject(error)
          })

          req.write(JSON.stringify(input))
          req.end()
        })
      }

      async function run(msg) {
        try {
          const result = await runAI("@cf/meta/llama-2-7b-chat-int8", {
            messages: [
              {
                role: "system",
                content:
                  "Responde a las preguntas al estilo ChatGPT (Te llamas Yukine). Si te escriben en español, responde en español, y así con otros idiomas. No incluyas en tu respuesta ningún emoji/emoji/sticker. Trata de ser conciso y no responder de más si no es solicitado.",
              },
              {
                role: "user",
                content: msg,
              },
            ],
          })

          return result
        } catch (error) {
          console.error("Error al ejecutar el modelo AI:", error)
        }
      }

      async function main(msg) {
        try {
          const result = await run(msg)
          return JSON.stringify(result)
        } catch (error) {
          console.error("Error en la ejecución principal:", error)
          return JSON.stringify({ error: "Error en la ejecución principal" })
        }
      }

      const mensaje = interaction.options.getString("mensaje")
      main(mensaje)
        .then((resultString) => {
          resultString = resultString.replace(
            /^\{"result":\{"response":"(.+)"\},"success":true,"errors":\[\],"messages":\[\]\}$/,
            "$1"
          )
          interaction.reply(resultString)
        })
        .catch((error) => console.error(error))
      break
    case "responder":
      const canal =
          interaction.options.getString("canal") || interaction.channel.id,
        id = interaction.options.getString("identificador"),
        msj = interaction.options.getString("mensaje")

      const originalMessage = await client.channels.cache
        .get(canal)
        ?.messages.fetch(id)
        .catch(console.error)

      if (originalMessage) {
        originalMessage.reply({
          content: msj,
        })
        await interaction.reply({
          content: "Respuesta enviada correctamente.",
          ephemeral: true,
        })
      } else {
        await interaction.reply({
          content: "Error en el ID del canal o del mensaje.",
          ephemeral: true,
        })
      }
      break
    case "hora":
      const zona = interaction.options.getString("zona") || "Europe/Spain"
      const fecha = new Date().toLocaleString("es-ES", { timeZone: zona })
      await interaction.reply(`La hora en ${zona} es: ${fecha}`)
      break
    case "avatar":
      const user = interaction.options.getUser("usuario")
      const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 })

      const embed = {
        color: 0xccccff,
        title: `Avatar de ${user.username}`,
        image: {
          url: avatarURL,
        },
      }

      await interaction.reply({ embeds: [embed] })
      break
    case "decir":
      const decir = interaction.options.getString("mensaje")
      await interaction.reply(decir)
      break

    case "imagen":

      await interaction.deferReply();

      const imageUrl = interaction.options.getString("url")

      try {
        const response = await fetch(imageUrl)

        if (!response.ok) {
          throw new Error('No se pudo obtener la imagen')
        }

        const arrayBuffer = await response.arrayBuffer();

        const imageBuffer = Buffer.from(arrayBuffer);

        const attachment = new AttachmentBuilder(imageBuffer, { name: 'image' });

        await interaction.editReply({ files: [attachment] })
        } catch (error) {
          console.error("Error al obtener la imagen:", error)
          await interaction.editReply("Hubo un error al procesar la imagen.")
        }

      break
    default:
      await interaction.reply(`No existe ese comando :(`)
      break
  }
})

client.login(TOKEN)
