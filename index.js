require("dotenv").config(); // Initialize dotenv
const axios = require("axios"); // Import axios
const { Client, GatewayIntentBits } = require("discord.js"); // Import discord.js

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
}); // Create new client

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const config = {
  prefix: "!",
};

let results;

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "samplify":
      try {
        let query = args.join(" ");
        results = await getSearchResults(query);
        // for each result, send its title and artist

        let text = "Showing results for " + query + "\n";

        results.forEach((result, index) => {
          text += index + 1 + ": " + result.title + " by " + result.artist + "\n";
        });

        const reply = message.reply(text);
        reply.then((msg) => {
          msg.react("1️⃣");
          msg.react("2️⃣");
          msg.react("3️⃣");
          msg.react("4️⃣");
        });
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

  let reactionIndex = 0;

  if (reaction.message.content.startsWith("Showing results for ")) {
    if (reaction.emoji.name === "1️⃣") {
      reactionIndex = 0;
    } else if (reaction.emoji.name === "2️⃣") {
      reactionIndex = 1;
    } else if (reaction.emoji.name === "3️⃣") {
      reactionIndex = 2;
    } else if (reaction.emoji.name === "4️⃣") {
      reactionIndex = 3;
    }

    const result = results[reactionIndex];
    const samples = await getSamples(result.id);
    const reply = await reaction.message.reply("Loading samples...");

    // Prepare the formatted message content and embeds
    const formattedSamples = JSON.parse(samples);
    if(formattedSamples.length === 0) {
      reply.edit("No samples found.");
      return;
    }
    const embeds = [];

    formattedSamples.forEach((sample, index) => {
      const sampleContent =
        `  Title: ${sample.title}\n` +
        `  Artist: ${sample.artist}\n` +
        `  Year: ${sample.year}\n`;

      const embed = {
        description: sampleContent,
        image: {
          url: sample.imgUrl,
        },
      };

      embeds.push(embed);
    });

    // Edit the loading message with the formatted samples content and images
    embeds.forEach((embed, index) => {
      if (index === 0) {
        reply.edit({
          embeds: [embed],
        });
      } else {
        reply.channel.send({
          embeds: [embed],
        });
      }
    });
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

// Make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); // Login bot using token
