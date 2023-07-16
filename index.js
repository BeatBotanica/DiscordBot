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
    case "samplify":
      try {
        let query = args.join(" ");
        const results = await getSearchResults(query);
        // for each result, send its title and artist

        let text = "Showing results for " + query + "\n";

        results.forEach((result, index) => {
          text += index+1 + ": " + result.title + " by " + result.artist + "\n";
        });

        message.reply(text);
      } catch (err) {
        message.reply(
          "Something went wrong. Please make sure to use the following format if you haven't: !samplify <search query> \n" +
            err.toString()
        );
      }
      break;
    default:
      break;
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  if (reaction.emoji.name === "1️⃣") {
    const message = reaction.message;
    message.reply("You reacted with a 1");

  } else if(reaction.emoji.name === "2️⃣") {


  } else if(reaction.emoji.name === "3️⃣") {


  } else if(reaction.emoji.name === "4️⃣") {


  }
});

async function getSamples(id) {
  const res = await axios.get(
    `https://rangi.beatbotanica.com/api/samples?id=${id}`
  );
  return JSON.stringify(res.data);
}

async function getSearchResults(query) {
  const res = await axios.get(
    `https://rangi.beatbotanica.com/api/search?q=${query}&num=4`
  );
  return res.data;
}

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
