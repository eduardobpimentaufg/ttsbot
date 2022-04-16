var synth = window.speechSynthesis;
var voiceSelect = document.querySelector('select');
// voices = synth.getVoices();
var voices = [];
var ptbrIndex = -1;
function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1;
    });
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for(i = 0; i < voices.length ; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
      
      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }
  
      option.setAttribute('data-lang', voices[i].lang);
      if (voices[i].lang === 'pt-BR') {
        ptbrIndex = i;
      }
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = selectedIndex;
    if (ptbrIndex >= 0) {
        voiceSelect.selectedIndex = ptbrIndex;
    }
}

function connect() {
    populateVoiceList();
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
        channels: [ 'bizarelli' ]
    });
    // client.connect().catch(console.error);
    client.connect().catch((e) => {
        console.error(e);
        document.querySelector("#status").textContent = "Status: falha ao conectar à Twitch: " + e;
    });
    client.on('message', (channel, tags, message, self) => {
        if(self) return;
        msg = message.toLowerCase();
        if(msg.startsWith("!voz") === true) {
            msg = msg.replace('!voz', '').trim();
            msg = msg.substring(0, 300); // comprimento máximo da mensagem.
            // client.say(channel, `@${tags.username}, ` + msg);
            // console.log(channel);
            var frase = new SpeechSynthesisUtterance(msg);
            var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
            for(i = 0; i < voices.length ; i++) {
              if(voices[i].name === selectedOption) {
                frase.voice = voices[i];
                break;
              }
            }
            synth.speak(frase);
        }
    });
    client.on("connected", (addr, port) => {
        console.log("Conectou à Twitch");
        document.querySelector("#status").textContent = "Status: conectado à Twitch";
        client.say("#bl00dshoot", 'Bot de TTS conectado.');
    });
    client.on("connecting", (addr, port) => {
        console.log("Conectando à Twitch");
        document.querySelector("#status").textContent = "Status: conectando-se à Twitch";
    });
    client.on("disconnected", (reason) => {
        console.log("Conectando à Twitch");
        document.querySelector("#status").textContent = "Status: disconectado da Twitch. Motivo : " + reason;
    });
    
    document.querySelector("#conectarbtn").hidden = true;
    
}

