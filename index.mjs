import http from 'node:http';
import bp from 'body-parser';
import express from 'express';
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

var hosts = {};

function flush() {
	const now = Date.now();
	const l = Object.keys(hosts);
	for (var _r of l) {
		try {
			const r = hosts[_r];
			if (r.expires <= now || !r.expires) {
				if (hosts[_r]) delete hosts[_r];
			}
		} catch (err) {
			console.error(err);
		}
	}
}
flush();
setInterval(flush, 60 * 60 * 1000);
function rooms() {
	return Object.values(hosts);
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
app.post('/api/host', (req, res) => {
	try {
		var host = req.body;
		console.log(host);
		if (rooms().map(r => r.name).includes(host.name)) {
			hosts[host.apId].ev.emit('error', 'Name is taken');
		} else {
			hosts[host.apId] = {
				...host,
				...hosts[host.apId]
			}
			hosts[host.apId].ev.emit('ok');
		}
		res.send('ok');
	} catch (err) {
		console.error(err);
		try {
			delete hosts[host.apId];
		} catch {};
	}
});
app.get('/api/id', (req, res) => {
	try {
		const id = rand(4).toString('hex');
		console.log(id)
		hosts[id] = {
			expires: Date.now() + (24 * 60 * 60 * 1000),
			ev: new EventEmitter()
		}
		console.log(hosts[id]);
		res.send(id);
	} catch (err) {
		console.error(err);
	}
});
app.get('/api/ev', (req, res) => {
	try {
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
		console.log(hosts[id]);
		hosts[id].ev.on('error', err => {
			res.write('event: err\n');
			res.write(`data: ${err}\n\n`);
		});
		hosts[id].ev.on('ok', () => {
			console.log('ok');
			res.write('event: ok\n');
			res.write('data: ok\n\n');
		});
		res.on('close', () => {
			res.end();
			try {
				console.log('disconnect');
				//console.log(hosts.get(host.name), host)
				delete hosts[id];
			} catch (err) {
				console.error(err);
			}
		});
	} catch (err) {
		try { res.end(); } catch {};
		try { delete hosts[id] } catch {};
		console.error(err);
	}
});

server.listen(443, () => {
	console.log('server started');
});