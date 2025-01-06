const canvas = document.getElementById('mind-map');
const ctx = canvas.getContext('2d');

let nodes = [];
let arrows = [];
let selectedNode = null;
let isConnecting = false;
let isDeletingArrow = false;
let isDragging = false;
let currentColor = '#ffffff'; 
let offsetX, offsetY;


class Node {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.width = 100;
    this.height = 50;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#000000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 5);
  }

  isPointInside(px, py) {
    return px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height;
  }

  getEdgePoint(x, y) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const angle = Math.atan2(deltaY, deltaX);

    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    const edgeX = centerX + Math.cos(angle) * halfWidth;
    const edgeY = centerY + Math.sin(angle) * halfHeight;

    return { x: edgeX, y: edgeY };
  }
}

class Arrow {
  constructor(startNode, endNode, color) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.color = color;
  }

  draw() {
    const startEdge = this.startNode.getEdgePoint(this.endNode.x + this.endNode.width / 2, this.endNode.y + this.endNode.height / 2);
    const endEdge = this.endNode.getEdgePoint(this.startNode.x + this.startNode.width / 2, this.startNode.y + this.startNode.height / 2);

    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(startEdge.x, startEdge.y);
    ctx.lineTo(endEdge.x, endEdge.y);
    ctx.stroke();

    const angle = Math.atan2(endEdge.y - startEdge.y, endEdge.x - startEdge.x);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(endEdge.x, endEdge.y);
    ctx.lineTo(endEdge.x - 10 * Math.cos(angle - Math.PI / 6), endEdge.y - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endEdge.x - 10 * Math.cos(angle + Math.PI / 6), endEdge.y - 10 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodes.forEach(node => node.draw());
  arrows.forEach(arrow => arrow.draw());
}

document.getElementById('new-node').addEventListener('click', () => {
  const x = Math.random() * (canvas.width - 100);
  const y = Math.random() * (canvas.height - 50);
  const text = prompt('Enter node text:', 'New Node');
  if (text) {
    nodes.push(new Node(x, y, text, currentColor));
    draw();
  }
});

document.getElementById('delete-node').addEventListener('click', () => {
  if (selectedNode) {
    nodes = nodes.filter(node => node !== selectedNode);
    arrows = arrows.filter(arrow => arrow.startNode !== selectedNode && arrow.endNode !== selectedNode);
    selectedNode = null;
    draw();
  }
});

document.getElementById('connect-nodes').addEventListener('click', () => {
  isConnecting = true;
  isDeletingArrow = false;
});

document.getElementById('delete-arrow').addEventListener('click', () => {
  isDeletingArrow = true;
  isConnecting = false;
});

document.getElementById('clear-map').addEventListener('click', () => {
  nodes = [];
  arrows = [];
  draw();
});

document.getElementById('save-map').addEventListener('click', () => {
  const data = {
    nodes: nodes.map(node => ({
      x: node.x,
      y: node.y,
      text: node.text,
      color: node.color
    })),
    arrows: arrows.map(arrow => ({
      startNode: nodes.indexOf(arrow.startNode),
      endNode: nodes.indexOf(arrow.endNode),
      color: arrow.color
    }))
  };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mind-map.json';
  a.click();
});

document.getElementById('load-map').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      nodes = data.nodes.map(node => new Node(node.x, node.y, node.text, node.color));
      arrows = data.arrows.map(arrow => new Arrow(nodes[arrow.startNode], nodes[arrow.endNode], arrow.color));
      draw();
    };
    reader.readAsText(file);
  };
  input.click();
});

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  selectedNode = nodes.find(node => node.isPointInside(x, y));

  if (selectedNode) {
    isDragging = true;
    offsetX = x - selectedNode.x;
    offsetY = y - selectedNode.y;
  }

  if (isConnecting && selectedNode) {
    if (arrows.length > 0 && arrows[arrows.length - 1].startNode === selectedNode) return; 
    if (arrows.length % 2 === 0) {
      arrows.push(new Arrow(selectedNode, null, currentColor));
    } else {
      arrows[arrows.length - 1].endNode = selectedNode;
      arrows[arrows.length - 1].color = currentColor;
    }
    draw();
  } else if (isDeletingArrow) {
    arrows = arrows.filter(arrow => {
      const startEdge = arrow.startNode.getEdgePoint(arrow.endNode.x + arrow.endNode.width / 2, arrow.endNode.y + arrow.endNode.height / 2);
      const endEdge = arrow.endNode.getEdgePoint(arrow.startNode.x + arrow.startNode.width / 2, arrow.startNode.y + arrow.startNode.height / 2);
      const distance = Math.abs((endEdge.y - startEdge.y) * x - (endEdge.x - startEdge.x) * y + endEdge.x * startEdge.y - endEdge.y * startEdge.x) /
        Math.sqrt((endEdge.y - startEdge.y) ** 2 + (endEdge.x - startEdge.x) ** 2);
      return distance > 5; 
    });
    draw();
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedNode) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    selectedNode.x = x - offsetX;
    selectedNode.y = y - offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('dblclick', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const node = nodes.find(node => node.isPointInside(x, y));
  if (node) {
    const newText = prompt('Edit node text:', node.text);
    if (newText !== null) {
      node.text = newText;
      draw();
    }
  }
});

document.querySelectorAll('.color-box').forEach(colorBox => {
  colorBox.addEventListener('click', () => {
    currentColor = colorBox.getAttribute('data-color');
    if (selectedNode) {
      selectedNode.color = currentColor;
      draw();
    }
  });
});

draw();