require("dotenv").config(); //initialize dotenv
const axios = require("axios"); //import axios
const { Client, GatewayIntentBits } = require("discord.js"); //import discord.js

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}); //create new client

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const config = {
  prefix: "!",
};

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "samples":
      try {
        let [id] = args;
        const samples = await getSamples(id);
        message.reply(samples);
      } catch (err) {
        message.reply(
          "Invalid syntax. Please use the following format: !samples <song id>" +
            err.toString()
        );
      }
      break;
    default:
      break;
  }
});

async function getSamples(id) {
  const res = await axios.get(
    `https://samplify.vercel.app/api/samples?id=${id}`
  );
  return JSON.stringify(res.data);
}

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
