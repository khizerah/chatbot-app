const userInput = document.getElementById('user-input');
const chatArea = document.getElementById('chat-area');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');
const toggleModeBtn = document.getElementById('toggle-mode');
const resetChatBtn = document.getElementById('reset-chat');
const exportChatBtn = document.getElementById('export-chat');

let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

function addMessage(content, sender = 'user') {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.innerHTML = content;
    chatArea.appendChild(message);
    chatArea.scrollTop = chatArea.scrollHeight;

    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ sender, content });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function botTypingEffect(text) {
    const typingMsg = document.createElement('div');
    typingMsg.classList.add('message', 'bot', 'typing');
    typingMsg.innerHTML = 'Typing...';
    chatArea.appendChild(typingMsg);
    chatArea.scrollTop = chatArea.scrollHeight;

    setTimeout(() => {
        typingMsg.remove();
        addMessage(text, 'bot');
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

function botReply(userText) {
    let reply = '';
    userText = userText.toLowerCase();

    if (userText.includes('hello') || userText.includes('hi')) {
        reply = "Hello! 👋 How can I assist you today?";
    } else if (userText.includes('how are you')) {
        reply = "I'm always great! 😊 How about you?";
    } else if (userText.includes('your name')) {
        reply = "I'm your smart AI friend! 🤖";
    } else if (userText.includes('weather')) {
        reply = "I'm not connected to live weather APIs yet, but I hope it's a nice day! 🌞";
    } else {
        reply = "That's interesting! 🤔 I'll do my best to help! 🌟";
    }

    botTypingEffect(reply);
}

sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (text !== '') {
        addMessage(text, 'user');
        botReply(text);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

voiceBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    }
});

if (recognition) {
    recognition.onresult = (event) => {
        const voiceText = event.results[0][0].transcript;
        userInput.value = voiceText;
        sendBtn.click();
    };
}

toggleModeBtn.addEventListener('click', () => {
    document.getElementById('chatbot-app').classList.toggle('light-mode');
});

resetChatBtn.addEventListener('click', () => {
    localStorage.removeItem('chatHistory');
    chatArea.innerHTML = '';
});

exportChatBtn.addEventListener('click', () => {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    let chatText = '';
    chatHistory.forEach(({ sender, content }) => {
        chatText += `${sender.toUpperCase()}: ${content}\n`;
    });

    const blob = new Blob([chatText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat-history.txt';
    link.click();
});

window.onload = () => {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(({ sender, content }) => addMessage(content, sender));
};
