const micBtn = document.getElementById('mic-btn');
const textInput = document.getElementById('text-input');
const sendBtn = document.getElementById('send-btn');
const status = document.getElementById('status');

let isListening = false;
let recognition;

// Check if browser supports speech recognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const userQuestion = event.results[0][0].transcript;
    status.textContent = `You said: "${userQuestion}"`;
    getAIResponse(userQuestion);
  };

  recognition.onerror = () => {
    status.textContent = "Sorry, I couldn't hear you. Try again.";
    micBtn.classList.remove('listening');
    isListening = false;
  };
} else {
  status.textContent = "Your browser doesn't support voice input.";
}

// Mic Button
micBtn.addEventListener('click', () => {
  if (!recognition) return;
  
  if (!isListening) {
    recognition.start();
    isListening = true;
    micBtn.classList.add('listening');
    status.textContent = "Listening... Speak now";
  }
});

// Send text question
sendBtn.addEventListener('click', () => {
  const question = textInput.value.trim();
  if (question) {
    status.textContent = `You: ${question}`;
    getAIResponse(question);
    textInput.value = '';
  }
});

textInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

// Fake AI Response (You can replace this with real AI later)
async function getAIResponse(question) {
  status.textContent = "Thinking...";
  
  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simple responses (Replace with real AI API later)
  let reply = "I'm sorry, I don't understand that yet.";

  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes("hello") || lowerQ.includes("hi")) reply = "Hello! How can I help you today?";
  else if (lowerQ.includes("how are you")) reply = "I'm doing great, thank you for asking!";
  else if (lowerQ.includes("name")) reply = "I'm your Voice AI Assistant. Nice to meet you!";
  else if (lowerQ.includes("weather")) reply = "I can't check real weather yet, but I hope it's sunny where you are!";
  else reply = `You asked: ${question}. This is a voice reply.`;

  // Speak the reply
  speak(reply);
}

// Text-to-Speech Function
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    
    status.textContent = "AI is speaking...";
    window.speechSynthesis.speak(utterance);
    
    utterance.onend = () => {
      status.textContent = "Ask me anything...";
    };
  } else {
    status.textContent = "Voice not supported in this browser.";
  }
}
