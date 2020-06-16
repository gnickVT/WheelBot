const eris = require('eris');
const { BOT_TOKEN } = require('../config.json');

//Custom prefix to envoke the WheelBot
const PREFIX = 'wheel:';

//Set to contain list of games
var gameList = new Set()

// Create a Client instance with our bot token.
const bot = new eris.Client(BOT_TOKEN);

const commandHandlerForCommandName = {};
commandHandlerForCommandName['addpayment'] = (msg, args) => {
	const mention = args[0];
	const amount = parseFloat(args[1]);

	//TODO: Handle invalid command arguments, such as;
	//1. No mention or invalid mention
	//2. No amount or invalid amount.
	
	return msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`);
};

commandHandlerForCommandName['add'] = (msg, args) => {
	const gameLength = args.length;
	if(gameLength == 1) {
		gameName = args[0];
	}
	else if(gameLength >= 2) {
		for (i = 0; i < gameLength; i++) {
			if(i == 0)
				var name = args[i]+" ";
			else if(i == gameLength-1)
				var name = name+args[i];
			else
				var name = name+args[i]+" ";
		}
		gameName = name;
	}
	
	if(gameList.has(gameName))
	{
		return msg.channel.createMessage(`'${gameName}' is already on the wheel`);
	}
	else
	{
		gameList.add(gameName);
		console.log(gameList);
		return msg.channel.createMessage(`'${gameName}' added to the wheel`);
	}
};

commandHandlerForCommandName['clear'] = (msg, args) => {
	gameList.clear();
	console.log(gameList);
	return msg.channel.createMessage(`Wheel has been cleared`);
};

commandHandlerForCommandName['list'] = (msg, args) => {
	if(gameList.size == 0)
		msg.channel.createMessage('Wheel is currently empty');
	else {
		msg.channel.createMessage('Here is whats on the wheel: ');
		gameList.forEach(game => {
			msg.channel.createMessage(`${game}`);
		});
	}
};

commandHandlerForCommandName['remove'] = (msg, args) => {
	const gameLength = args.length;
	if(gameLength == 1) {
		gameName = args[0];
	}
	else if(gameLength >= 2) {
		for (i = 0; i < gameLength; i++) {
			if(i == 0)
				var name = args[i]+" ";
			else if(i == gameLength-1)
				var name = name+args[i];
			else
				var name = name+args[i]+" ";
		}
		gameName = name;
	}

	if(gameList.has(gameName)) {
		gameList.delete(gameName);
		console.log(gameList);
		msg.channel.createMessage(`'${gameName}' has been removed from the wheel`);
	}
	else {
		console.log(gameList);
		msg.channel.createMessage(`'${gameName}' is not currently on the wheel`);
	}
};

commandHandlerForCommandName['spin'] = (msg, args) => {
	Set.prototype.getByIndex = function(index) {return [...this][index];}
	
	if(gameList.size == 0)
		return msg.channel.createMessage('Nothing to spin; Wheel empty');

	var max = gameList.size;
	var rand = Math.floor((Math.random() * max));
	//var selectedGame = gameList.getByIndex(rand);
	//console.log(gameList.getByIndex(rand));
	var selectedGame = Array.from(gameList)[rand];
	msg.channel.createMessage(`WheelBot has chosen: "${selectedGame}"`);
};


// When the bot is connected and ready, log to console.
bot.on('ready', () => {
  console.log('WheelBot connected and ready.');
});

commandHandlerForCommandName['save'] = (msg, args) => {
	var wheelName = args[0];
	var nameLength = args.length;
	if(nameLength == 0)
		return msg.channel.createMessage('Please enter a name to save the current wheel as');
	else if(nameLength > 1)
		return msg.channel.createMessage('Wheel name must be one word');

	msg.channel.createMessage(`Wheel "${wheelName}" has been saved`);
};

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
bot.on('messageCreate', async (msg) => {
  const content = msg.content;
	//Ignore any messages sent as direct messages.
	//The bot will only accept commands issued in a guild
	if(!msg.channel.guild) {
		return;
	}

	//Ignore any message that doesn't start with the correct prefix.
	if(!content.startsWith(PREFIX)) {
		return;
	}

	//Extract the parts of the command and the command name
	const parts = content.split(' ').map(s => s.trim()).filter(s => s);
	const commandName = parts[0].substr(PREFIX.length);

	//Get the appropriate handler for the comand, if there is one.
	const commandHandler = commandHandlerForCommandName[commandName];
	if(!commandHandler) {
		return;
	}

	//Separate the command arguments from the command prefix and command name.
	const args = parts.slice(1);

	try {
		//Execute the command.
		await commandHandler(msg, args);
	} catch (err) {
		console.warn('Error handling command');
		console.warn(err);
	}
});

bot.on('error', err => {
  console.warn(err);
});

bot.connect();
