const { Telegraf } = require("telegraf");
require("dotenv").config();
const fs = require("fs");

const DICT_FILE_PATH = "./data/WebstersEnglishDictionary.json";

/******************************************/

var token = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(token);
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");

console.log("I don't know how this is running :o");

/******************************************/

const help_text = `
Hope you have a good day! The following are some of the commands that can be used.
1. /start - To check if the telegram bot is up and running.
2. /help - To list all the commands and its usage
3. /word - Gets random list of words and definition
4. /define <word> - Gets definition if present
`;

bot.start((ctx) => ctx.reply("Server is up! I am listening..."));
bot.help((ctx) => ctx.reply(help_text));
// bot.on("sticker", (ctx) => ctx.reply("👍"));
// bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.command("word", (ctx) => {
  fs.readFile(DICT_FILE_PATH, (err, data) => {
    var num = ctx.message.text.replace("/word", "").trim();
    if (isNaN(num) || !num) {
        num = 3;
    }
    if (err) throw err;
    let dictionary = JSON.parse(data);
    const replyMsg = getListOfWords(dictionary, num);
    let replyText = replyMsg;
    var temp_message = ctx.message;
    replyText.forEach((word, index) => {
      temp_message.text = `${word}`;
      ctx.telegram.sendCopy(ctx.chat.id, temp_message, Extra.markup(keyboard));
    });
  });
});

bot.command("define", (ctx) => {
  var msg = ctx.message.text;
  //   console.log(msg.replace("/define", "").trim().toLowerCase());
  const word = msg.replace("/define", "").trim().toLowerCase();
  var temp_message = ctx.message;
  fs.readFile(DICT_FILE_PATH, (err, data) => {
    if (err) throw err;
    let dictionary = JSON.parse(data);
    if (dictionary[word]) {
      temp_message.text = `${word}\n\n${dictionary[word]}`;
      ctx.telegram.sendCopy(ctx.chat.id, temp_message, Extra.markup(keyboard));
    } else {
      temp_message.text = `Word not found (o_O) !`;
      ctx.telegram.sendCopy(ctx.chat.id, temp_message);
    }
  });
});

const keyboard = Markup.inlineKeyboard([
  //   Markup.urlButton("❤️", "http://telegraf.js.org"),
  //   Markup.callbackButton("✔️", "learnt"),
  Markup.callbackButton("❌", "skipped"),
]);
bot.on("message", (ctx) => {
  //   var temp_message = ctx.message;
  //   temp_message.text = "123";
  //   ctx.telegram.sendCopy(ctx.chat.id, temp_message, Extra.markup(keyboard));
  //   temp_message.text = "234";
  //   ctx.telegram.sendCopy(ctx.chat.id, temp_message, Extra.markup(keyboard));
  //   ctx.telegram.sendCopy(ctx.chat.id, "2", Extra.markup(keyboard));
  //   ctx.telegram.sendCopy(ctx.chat.id, "23", Extra.markup(keyboard));
  //   ctx.telegram.sendCopy(ctx.chat.id, ctx.message, Extra.markup(keyboard));
  //   console.log(ctx.chat.id, ctx.message);
  throw new Error("Example error");
});
bot.action("learnt", ({ heelo }) => {
  console.log("hello");
});
bot.action("skipped", ({ deleteMessage }) => deleteMessage());
bot.action("delete", ({ deleteMessage }) => deleteMessage());
bot.catch((err, ctx) => {
  //   console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  ctx.reply(`Well that is embarassing ﾍ(･_|`);
});
bot.launch();
bot.startPolling();
/******************************************/

function getListOfWords(listOfWords, num = 3) {
  let dictLength = Object.keys(listOfWords).length;
  //   console.log(dictLength);
  let uniqueIndex = [];
  let returnDict = [];
  for (let i = 0; i < num; i++) {
    uniqueIndex.push(Math.floor(Math.random() * dictLength + 1) - 1);
  }
  //   console.log(uniqueIndex);
  uniqueIndex = [...new Set(uniqueIndex)];
  //   console.log(uniqueIndex);
  uniqueIndex.forEach((index) => {
    returnDict.push(
      `
      ${Object.keys(listOfWords)[index]} \n
      ${Object.values(listOfWords)[index]}
      `
    );
  });
  //   console.log(returnDict);
  return returnDict;
  return {
    DIPLOBLASTIC:
      "Characterizing the ovum when it has two primary germinallayers.",
    DEFIGURE:
      "To delineate. [Obs.]These two stones as they are here defigured. Weever.",
    LOMBARD: "Of or pertaining to Lombardy, or the inhabitants of Lombardy.",
    BAHAISM: "The religious tenets or practices of the Bahais.",
    FUMERELL: "See Femerell.",
  };
}

// function formatJSON(json) {
//   var returnArr = [];
//   Object.keys(json).forEach(function (k) {
//     returnArr.push(k + " - " + json[k]);
//   });
//   //   return [
//   //     Math.random().toString(36).substring(2, 7) +
//   //       Math.random().toString(36).substring(2, 3),
//   //   ];
//   return returnArr;
// }
