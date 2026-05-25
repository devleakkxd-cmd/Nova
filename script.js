const micBtn = document.getElementById('mic-btn');
const textInput = document.getElementById('text-input');
const sendBtn = document.getElementById('send-btn');
const status = document.getElementById('status');
const themeToggle = document.getElementById('theme-toggle');

const API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

let isListening = false;
let recognition;

// Theme Toggle
let isDark = true;
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Speech Recognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  recognition.onresult = (e) => {
    const question = e.results[0][0].transcript;
    status.textContent = `You: ${question}`;
    getAIResponse(question);
  };

  recognition.onerror = () => {
    status.textContent = "Couldn't hear you. Try again.";
    micBtn.classList.remove('listening');
  };
}

// Mic Button
micBtn.addEventListener('click', () => {
  if (recognition) {
    recognition.start();
    micBtn.classList.add('listening');
    status.textContent = "Listening... Speak now";
  }
});

// Send Button
sendBtn.addEventListener('click', () => {
  const q = textInput.value.trim();
  if (q) {
    status.textContent = `You: ${q}`;
    getAIResponse(q);
    textInput.value = '';
  }
});

textInput.addEventListener('keypress', e => {
  if (e.key === "Enter") sendBtn.click();
});

// Call OpenAI API
async function getAIResponse(question) {
  status.textContent = "AI is thinking...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }],
        temperature: 0.7
      })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content.trim();

    speak(reply);
  } catch (err) {
    status.textContent = "Error with API. Check your key or internet.";
    console.error(err);
  }
}

// Text to Speech (AI Voice Reply)
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    status.textContent = "AI is speaking...";
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      status.textContent = "Ask me anything...";
    };
  }
}
