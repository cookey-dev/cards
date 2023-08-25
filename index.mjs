import http from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import Database from '@replit/database';
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

var hosts = new Database();

async function rooms() {
	const l = await hosts.list();
	return Promise.all(l.map(k => hosts.get(k)));
}

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
app.get('/api/rooms', async (req, res) => {
	res.set('Content-Type', 'application/json');
	res.json({
		rooms: await rooms()
	});
});
io.on('connection', async sock => {
	var host;
	var peer;
	try {
		sock.on('host', async _host => {
			try {
				host = _host;
				sock.removeAllListeners('peer');
				console.log(host);
				if (await hosts.get(host.name)) {
					sock.emit('error', 'Name is taken');
				} else {
					hosts.set(host.name, host);
				}
			} catch (err) {
				console.error(err);
				try {
					hosts.delete(host.name);
				} catch {};
			}
		});
		sock.on('disconnect', async () => {
			try {
				console.log('disconnect');
				//console.log(hosts.get(host.name), host)
				await hosts.delete(host.name);
			} catch (err) {
				console.error(err);
				try {
					hosts.delete(host.name);
				} catch {};
			}
		});
	} catch (err) {
		console.error(err);
		try {
			hosts.delete(host.name);
		} catch {};
	}
});

server.listen(443, () => {
	console.log('server started');
});