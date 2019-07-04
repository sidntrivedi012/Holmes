var greet = require("./static/greet.json");
var config = {
  channels: ["#jiit"],
  server: "irc.freenode.net",
  botName: "markbot12345"
};
var irc = require("irc");

var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

// Listening for joins
bot.addListener("join", function(channel, who) {
  var max_len = Object.keys(greet).length - 1;
  var min = 0;
  var index = Math.floor(Math.random() * (+max_len - +min)) + +min;
  console.log(index);
  bot.say(channel, who + greet[index]);
  console.log(greet[index]);
});

bot.addListener("nick", function(oldnick, newnick, channel, message) {
  bot.say(channel, newnick + " seems kinda cool.");
});

bot.addListener("kick", function(channel, who, by, reason) {
  console.log("%s was kicked from %s by %s: %s", who, channel, by, reason);
});

// bot.addListener("action", function(from, to, text, message) {
//   bot.say(from, "hey");
// });
//to-channel,  -username, text-message
bot.addListener("message", function(nick, to, text, message) {
  console.log(nick, text, to);
});
