import http from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import { readFileSync as rf } from 'node:fs';

const app = express();
app.use(express.static('static'));
const server = http.createServer(app);
const io = new Server(server);
const peer = ExpressPeerServer(server, {
	path: "/server",
	debug: true,
	port: 443
});
app.use("/peer", peer);

var hosts = {};
app.get('/', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(rf('index.html', 'utf8'));
});
app.get('/game', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(rf('game.html', 'utf8'));
});
app.get('/host', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(rf('host.html', 'utf8'));
});
app.get('/peer', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(rf('peer.html', 'utf8'));
});
app.get('/join', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(rf('join.html', 'utf8'));
});
app.get('/api/rooms', (req, res) => {
	res.set('Content-Type', 'application/json');
	res.json({
		rooms: Object.values(hosts)
	});
});
io.on('connection', async sock => {
	var host;
	var peer;
	sock.on('host', _host => {
		host = _host;
		sock.removeAllListeners('peer');
		console.log(host);
		if (hosts[host.name]) {
			sock.emit('error', 'Name is taken');
		} else {
			hosts[host.name] = host;
		}
	});
	sock.on('disconnect', () => {
		//console.log(hosts.get(host.name), host)
		if (host && hosts[host.name] && hosts[host.name].id === host.id) {
			delete hosts[host.name];
		}
	})
});

server.listen(443, () => {
	console.log('server started');
});