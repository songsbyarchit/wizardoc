document.getElementById('start').addEventListener('click', () => {
  const status = document.getElementById('status');
  const recognition = new webkitSpeechRecognition(); // use SpeechRecognition if on Firefox
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    status.textContent = 'Listening...';
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript)
      .join('');
    console.log('Transcript:', transcript);
  };

  recognition.onerror = (event) => {
    console.error('Error:', event.error);
  };

  recognition.start();
});