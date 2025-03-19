const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const path = require('path');

const server = http.createServer((req, res) => {
  const currentDir = process.cwd();
  const requestedPath = decodeURIComponent(req.url.slice(1));
  const fullPath = path.join(currentDir, requestedPath);

  if (req.url === '/') {
    // Display directory listing
    fs.readdir(currentDir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<h1>Directory listing:</h1>');
      res.write('<ul>');

      files.forEach(file => {
        const filePath = path.join(currentDir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        const fileType = isDirectory ? 'directory' : 'file';
        res.write(`<li><a href="${file}">${file}</a> (${fileType})</li>`);
      });

      res.write('</ul>');
      res.end();
    });
  } else {
    // Attempt to serve the requested file
    fs.stat(fullPath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      fs.readFile(fullPath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        const ext = path.extname(fullPath).toLowerCase();
        let contentType = 'text/plain';

        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'application/javascript';
        else if (ext === '.json') contentType = 'application/json';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

const Server = new WebSocket.Server({ server, path: '/ws' });
let drawingPoints = [];
const MAX_POINTS = 10000;

function saveDrawingPoints() {
  fs.writeFile('drawingPoints.json', JSON.stringify(drawingPoints), (err) => {
    if (err) console.error('Error saving drawing points:', err);
    // else console.log('Drawing points saved');
  });
}

// Load existing points if file exists
if (fs.existsSync('drawingPoints.json')) {
  try {
    const data = fs.readFileSync('drawingPoints.json', 'utf8');
    drawingPoints = JSON.parse(data);
    console.log('Loaded existing drawing points.');
  } catch (err) {
    console.error('Error reading drawing points file:', err);
  }
} else {
  console.log('No existing drawing points file found. Starting with an empty array.');
  saveDrawingPoints(); // Create initial empty file
}

Server.on('connection', function (ws) {
  // Send all saved drawing points to the newly connected client
  if (drawingPoints.length > 0) {
    ws.send(JSON.stringify({
      type: 'initialDrawing',
      points: drawingPoints
    }));
  }

  ws.on('message', function (data, isBinary) {
		var request = JSON.parse(data);

		if (request.type === 'drawing' || request.type === 'erase') {
			drawingPoints.push(request);
			if (drawingPoints.length > MAX_POINTS) {
				drawingPoints.shift(); // Remove oldest point
			}
      saveDrawingPoints(); // Save immediately after each update
		}

    // gets data first opening
    if (request.action == 'first' && Server.clients.size > 1) {
      for (const client of Server.clients) {
        if (ws === client) return;
        client.send(JSON.stringify({
          type: type,
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color: color
        }), { binary: isBinary });
        break;
      }
    }

    // sends data all clients
    Server.clients.forEach(function (client) {
      if (client !== ws) { // Don't send back to the sender
	      client.send(data, { binary: isBinary });
			}
    });
  });
});
