let recognition;

chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ Background service worker installed');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('🎤 Starting speech recognition');

  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🟢 Listening...');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      console.log('📝 Transcribed:', transcript);

      // Example: send to content script (if needed)
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { transcript });
      });
    };

    recognition.onerror = (event) => {
      console.error('⚠️ Error:', event.error);
    };

    recognition.onend = () => {
      console.log('🔴 Stopped listening');
    };

    recognition.start();
  } else {
    recognition.stop();
    recognition = null;
  }
});