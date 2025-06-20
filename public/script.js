const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Placeholder bot response while waiting
  const loadingMessage = document.createElement('div');
  loadingMessage.classList.add('message', 'bot');
  loadingMessage.textContent = 'Gemini is thinking...';
  chatBox.appendChild(loadingMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Send message to backend using fetch
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      loadingMessage.remove(); // Remove placeholder
      appendMessage('bot', data.reply); // Show actual reply
    })
    .catch(error => {
      console.error('Error sending message:', error);
      loadingMessage.remove(); // Remove placeholder
      appendMessage('bot', 'Error: Could not get a response.');
    });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
