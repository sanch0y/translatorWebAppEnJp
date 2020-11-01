const body = document.querySelector('body');
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjdMcSK9JXjSRBT1TBz7GppnNU2KbKhHk",
  authDomain: "japanese-message.firebaseapp.com",
  databaseURL: "https://japanese-message.firebaseio.com",
  projectId: "japanese-message",
  storageBucket: "japanese-message.appspot.com",
  messagingSenderId: "439307272156",
  appId: "1:439307272156:web:27c3eeaa559f4e1076d919"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Firebase DB reference
const db = firebase.database().ref('doctor/' + '1');
// Firebase Insert
function fireBaseInsert(message) {
  console.log(message);
  db.set({
    idOfDoctor: '1',
    message: message
  });
}
// Firebase Get
function fireBaseGet() {
  db.on('value', function(snapshot) {
    document.getElementById("listeningoutput").textContent = snapshot.val().message;
  });
}
fireBaseGet();
/*End of Firebase*/

/*For Language*/
let language = '';
let languageSelectionCheck = true;
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    // pageLanguage: 'en',
    includedLanguages: 'ja,en'
  }, 'google_translate_element');
}

/*Toggle Selection*/
document.querySelector('.checkbox').addEventListener('change', toggleForLanguage);
function toggleForLanguage(event){
  var select = document.querySelector('select.goog-te-combo');
  if (event.target.checked) {
    console.log('Japanese is Selected');
    if(languageSelectionCheck){
      select.selectedIndex = 2;
      languageSelectionCheck=false;
    }
    else {
      select.selectedIndex = 1;
    }
    select.dispatchEvent(new Event('change'));
    language = "ja";
  } else {
    console.log('English is Selected');
    if(languageSelectionCheck){
      select.selectedIndex = 1;
      languageSelectionCheck=false;
    }
    else {
      select.selectedIndex = 0;
    }
    select.dispatchEvent(new Event('change'));
    language = "en";
  }
}
/*End of Toggle Selection*/
/*End of Language*/

/*for Speaking */
document.getElementById('speak').addEventListener('click', runSpeechRecognition);
function runSpeechRecognition() {
  // get output div reference
  const output = document.getElementById("speakingoutput");
  // get action element reference
  const action = document.getElementById("action");
  // new speech recognition object
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  let recognition = new SpeechRecognition();
  recognition.continuous = true;

  if(language == "ja"){
    recognition.lang = 'ja';
  }
  else if(language == "en"){
    recognition.lang = 'en';
  }

  // This runs when the speech recognition service starts
  recognition.onstart = function() {
    action.innerHTML = "<small>listening, please speak...</small>";
  };

  recognition.onspeechend = function() {
    action.innerHTML = "<small>stopped listening</small>";
    recognition.stop();
  }

  // This runs when the speech recognition service returns result
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    // var confidence = event.results[0][0].confidence;
    const yousaidspan = document.getElementById("yousaid");
    yousaidspan.innerHTML = "<small style='color:#f44336'>You've just said...</small>";
    output.value = transcript;
    fireBaseInsert(transcript);
  };
  // start recognition
  recognition.start();
}
/*End of speaking*/

/* JS for Listening */
document.getElementById('listen').addEventListener('click', runSpeechSynthesis);

function runSpeechSynthesis() {
  const listeningdiv = document.getElementById("listeningoutput");
  listeningdiv.style.color = '#fff';
  let msg = listeningdiv.textContent;
  console.log(msg);

  body.style.background = '#141414 url(wave.gif)';
  body.style.backgroundRepeat = 'repeat-x';
  body.style.backgroundSize = '100% 100%';

  let speech = new SpeechSynthesisUtterance();

  if(language == "ja"){
    speech.lang = "ja-JP";
  }
  else if(language == "en"){
    speech.lang = "en-US";
  }

  speech.text = msg;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);

  speech.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    };

  const youarelistening = document.getElementById("youarelisteninnng");
  youarelistening.innerHTML = "<small style='color:#55acee'>You're listening...</small>";
}
/* JS for Listening */
