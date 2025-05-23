console.log("📄 Voice Dictation content script loaded");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("🎙️ Speech recognition not supported.");
} else {
  let recognition = null;
  let isListening = false;

  const button = document.createElement('button');
  button.textContent = '🎤';
  button.id = 'voice-dictation-toggle';
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10000,
    background: '#ffffff',
    border: '2px solid #444',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 0 6px rgba(0,0,0,0.2)'
  });

  const container = document.querySelector('.kix-appview-editor') || document.body;
  container.appendChild(button);

  function startRecognition() {
    if (recognition) return;

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("🎤 Listening...");
      button.style.background = '#e74c3c'; // red
    };

    recognition.onend = () => {
      console.log("🛑 Stopped listening");
      recognition = null;
      button.style.background = '#ffffff';
    };

    recognition.onerror = (e) => {
      console.error("❌ Error:", e.error);
    };

    recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
    console.log("📝 Transcript:", transcript);

    function insertTextLikeTyping(text) {
    const doc = document.querySelector('.kix-canvas-tile-content');

    if (doc) {
        const activeEl = document.activeElement;
        activeEl.dispatchEvent(new InputEvent('input', {
        data: text,
        inputType: 'insertText',
        bubbles: true,
        cancelable: true
        }));
    } else {
        console.warn("⚠️ No Google Docs editable canvas found");
    }
    }

    insertTextLikeTyping(transcript);
    };


    recognition.start();
  }

  button.addEventListener('click', () => {
    if (isListening) {
      recognition?.stop();
    } else {
      startRecognition();
    }
    isListening = !isListening;
  });
}