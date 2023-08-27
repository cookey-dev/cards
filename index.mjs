import http from 'node:http';
import bp from 'body-parser';
import express from 'express';
import Database from '@replit/database';
import { ExpressPeerServer } from 'peer';
import { EventEmitter } from 'node:events';
import { readFileSync as rf } from 'node:fs';
import { randomBytes as rand } from 'node:crypto';

const app = express();
app.use(bp.json());
app.use(express.static('static'));

const server = http.createServer(app);
const peer = ExpressPeerServer(server, {
	path: "/server",
	debug: true,
	port: 443
});
app.use("/peer", peer);

var hosts = new Database();
var evs = {};

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
app.post('/api/host', async (req, res) => {
	try {
		var host = req.body;
		console.log(host);
		if ((await rooms()).map(r => r.name).includes(host.name)) {
			(await hosts.get(host.id)).ev.emit('error', 'Name is taken');
		} else {
			hosts.set(host.id, {
				...host,
				...await hosts.get(host.id)
			});
			evs[id].emit('ok');
		}
	} catch (err) {
		console.error(err);
		try {
			await hosts.delete(host.id);
		} catch {};
	}
});
app.get('/api/id', async (req, res) => {
	const id = rand(4).toString('hex');
	console.log(id)
	await hosts.set(id, {});
	evs[id] = new EventEmitter();
	res.send(id);
});
app.get('/api/ev', async (req, res) => {
	res.set({
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		'Access-Control-Allow-Origin': '*',
		'Connection': 'keep-alive'
	});
	res.flushHeaders();
	const id = req.query.id;
	console.log(id);
	res.write('event: id\n');
	res.write(`data: ${id}\n\n`);
	evs[id].on('error', err => {
		res.write('event: err\n');
		res.write(`data: ${err}\n\n`);
	});
	evs[id].on('ok', () => {
		res.write('event: ok\n');
		res.write('data: ok\n\n');
	});
	res.on('close', async () => {
		res.end();
		try {
			console.log('disconnect');
			//console.log(hosts.get(host.name), host)
			await hosts.delete(host.name);
		} catch (err) {
			console.error(err);
		}
	});
});

server.listen(443, () => {
	console.log('server started');
});