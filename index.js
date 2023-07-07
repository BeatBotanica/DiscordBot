require("dotenv").config(); //initialize dotenv
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

client.on("messageCreate", (msg) => {
  if (msg.content === "ping") {
    msg.reply("Pong!");
  }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
