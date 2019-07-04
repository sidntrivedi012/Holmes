const rp = require("request-promise");
const $ = require("cheerio");
var irc = require("irc");
const axios = require("axios");

var greet = require("./static/greet.json");
var config = {
  channels: ["#jiit"],
  server: "irc.freenode.net",
  botName: "markbot12345"
};

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
  bot.say(
    channel,
    "Hush everyone !! " +
      oldnick +
      " will be known as " +
      newnick +
      " in this arena."
  );
});

bot.addListener("kick", function(channel, who, by, reason) {
  console.log("%s was kicked from %s by %s: %s", who, channel, by, reason);
});

bot.addListener("message", function(nick, to, text) {
  // removes ' ' and converts into array
  var args = text.split(" ");

  //xkcd script
  if (args[0] == "!xkcd") {
    var max = 3000;
    var min = 0;
    var index = Math.floor(Math.random() * (+max - +min)) + +min;
    const url = "https://xkcd.com/" + index;
    console.log(url);

    rp(url)
      .then(function(html) {
        //success!
        var strip = $("#comic > img", html)[0].attribs.src;
        bot.say(to, nick + " Here is an xkcd strip for ya - https:" + strip);
      })
      .catch(function(err) {
        //handle error
        console.log("error");
      });
  }

  //chuck norris script
  if (args[0] == "!chuck") {
    if (!args[1]) {
      var norris = "http://api.icndb.com/jokes/random";
    } else {
      var norris = "http://api.icndb.com/jokes/random?firstName=" + args[1];
    }
    // Make a request for a user with a given ID
    axios
      .get(norris)
      .then(function(response) {
        // handle success
        var joke = response["data"].value.joke;
        bot.say(to, joke);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  }
});
