const paper = document.getElementById('paper');
const ws = new WebSocket('ws://localhost:9090');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (paper.innerText.includes('Ready...')) paper.innerHTML = '';

  const div = document.createElement('div');
  div.className = 'receipt-item';
  div.innerText = data.text;
  paper.appendChild(div);

  paper.scrollTop = paper.scrollHeight;
};
