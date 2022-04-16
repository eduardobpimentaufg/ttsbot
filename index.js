var synth = window.speechSynthesis;
voices = synth.getVoices();

var utterThis = new SpeechSynthesisUtterance("Beatriz, toma vergonha na cara e para de pegar esse herói.");
// utterThis.voice = voices[17];

console.log("Carregou");

function fala() {
    for (var i = 0; i < 3; i++) {
        synth.speak(utterThis);
    }
}

const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: 'ttsbot69',
		password: 'oauth:pq94r3yrgifxqgfuj9bdfjfchf2gxq'
	},
	channels: [ 'bl00dshoot' ]
});
client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
	if(self) return;
    msg = message.toLowerCase();
	if(msg.startsWith("!voz") === true) {
        msg = msg.replace('!voz', '').trim();
		client.say(channel, `@${tags.username}, ` + msg);
        console.log(msg);
        var frase = new SpeechSynthesisUtterance(msg);
        synth.speak(frase);
	}
});

console.log("Conectou Twitch");