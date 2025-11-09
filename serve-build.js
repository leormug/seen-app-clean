const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2] || 3005);
const host = '0.0.0.0';
const root = path.resolve(__dirname, 'build');

const types = {
  '.html':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.gif':'image/gif',
  '.svg':'image/svg+xml',
  '.ico':'image/x-icon',
  '.map':'application/json; charset=utf-8',
  '.txt':'text/plain; charset=utf-8',
  '.woff':'font/woff',
  '.woff2':'font/woff2',
  '.ttf':'font/ttf',
  '.eot':'application/vnd.ms-fontobject',
};

function send(res, code, body, headers={}) {
  res.writeHead(code, Object.assign({'Cache-Control':'no-cache'}, headers));
  res.end(body);
}

function safePath(p) {
  const r = path.normalize(path.join(root, decodeURI(p)));
  return r.startsWith(root) ? r : root;
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = safePath(reqPath);
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (e, data) => {
      if (!e) {
        const ext = path.extname(filePath).toLowerCase();
        const ct = types[ext] || 'application/octet-stream';
        return send(res, 200, data, {'Content-Type': ct});
      }
      // SPA fallback to index.html
      fs.readFile(path.join(root, 'index.html'), (e2, data2) => {
        if (e2) return send(res, 404, 'Not found');
        send(res, 200, data2, {'Content-Type': 'text/html; charset=utf-8'});
      });
    });
  });
});

server.listen(port, host, () => {
  console.log(`listening http://${host}:${port}`);
});
