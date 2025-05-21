console.log("📄 Content script running in Google Docs");

// Support both SpeechRecognition and webkitSpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("🎙️ Speech recognition not supported in this environment.");
} else {
  let recognition;

  function startVoice() {
    if (recognition) return;

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => console.log("🎤 Listening...");
    recognition.onerror = (e) => console.error("❌ Recognition error:", e.error);
    recognition.onend = () => {
      console.log("🛑 Stopped");
      recognition = null;
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      console.log("📝 Transcript:", transcript);

      const editable = document.querySelector('[contenteditable="true"]');
      if (editable) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(transcript));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    recognition.start();
  }

  // Trigger voice start manually via Ctrl+V (for now)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'v') {
      console.log("🎬 Starting voice recognition...");
      startVoice();
    }
  });
}