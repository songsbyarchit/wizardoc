document.getElementById('start').addEventListener('click', () => {
  const status = document.getElementById('status');
  const output = document.getElementById('output');

  const recognition = new webkitSpeechRecognition(); // Use SpeechRecognition if Firefox
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    status.textContent = 'Listening...';
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript)
      .join('');
    output.value = transcript;
  };

  recognition.onerror = (event) => {
    status.textContent = 'Error: ' + event.error;
  };

  recognition.onend = () => {
    status.textContent = 'Stopped';
  };

  recognition.start();
});