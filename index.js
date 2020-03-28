'use strict';

const path = require('path');
const ENV_PATH = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_PATH });

/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

const fish = require('./fish.json');

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message starts with 'あつもり '
  if (message.content.startsWith('あつもり ')) {
    let month_req = message.content.match(/(\d+)月/);
    let time_req = message.content.match(/(\d+)時/);
console.log(time_req)
    let res = fish.fish;

    if (month_req != null) {
      res = season_select(month_req, res);
    }
    if (time_req != null) {
      res = time_select(time_req, res);
    }
console.log(res);
    res = season_format(res);
    res = time_format(res);

    res = make_fields(res);

console.log(res);
    message.channel.send({embed: {fields: res}});
  }
});

// Season Select
const season_select = (month, object) => {
  console.log(object);
  let res = []
  if (month) {
    res = object.filter((item) => {
      if (item.season[parseInt(month)] === 1 ) return true;
    });
  }
  return res;
}

// Time Select
const time_select = (time, object) => {
  console.log(object);
  let res = []
  if (time) {
    res = object.filter((item) => {
      if (item.time[parseInt(time)] === 1 ) return true;
    });
  }
  console.log(res);
  return res;
}

// Season Format
const season_format = (object) => {
  let res_fields = object.map(item => {
    let season_str = '';

    // Season
    if (item.season[0] === 1) {
      season_str = 'いつでも';
    } else {
      let str_tmp = '';
      for (let i = 1; i < 13; i++) {
        if (item.season[i] === 1) {
          str_tmp += ', ' + i;
        }
      }
      str_tmp += '月';
      season_str = str_tmp.replace(/^, (.*)/, '$1')
    }
    item.season_str = season_str;
    return item;
  });
  return res_fields;
}

// Time Format
const time_format = (object) => {
  let res_fields = object.map(item => {
    let time_str = '';

    // Time
    if (item.time.reduce((sum, cur) => sum + cur) === 24) {
      time_str = 'いつでも';
    } else {
      let str_tmp = '';
      let time_flag = false;
      for (let i = 0; i < 24; i++) {
        if (item.time[i] === 1) {
          if (i === 23) {
            if (time_flag) {
              str_tmp += '-' + i;
            } else {
              str_tmp += i;
            }
          } else {
            if (! time_flag) {
              str_tmp += ', ' + i;
              time_flag = true;
            }
          }
        } else {
          if (time_flag) {
            str_tmp += '-' + (i - 1);
            time_flag = false;
          }
        }
      }
      str_tmp += '時台';
      time_str = str_tmp.replace(/^, (.*)/, '$1')
    }
    item.time_str = time_str;
    return item;
  });
  return res_fields;
}


// Make Fields
const make_fields = (object) => {
  let res = object.map((item) => {
    let field = {};
    field.name = item.name;
    field.value = '買取額: ' + item.price + 'ベル\n時期: ' + item.season_str + '\n時間帯: ' + item.time_str + '\n場所: ' + item.place;
    if (item.special) {
      field.value += '\n特殊事項: ' + item.special;
    }
    field.inline = true;
    return field;
  });
  return res;
}

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);
