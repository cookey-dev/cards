var joinAsPeer;
var copyJoinLink;
var cds;
var start;
var evt;
(async () => {
var info;

var notifs;
window.addEventListener('load', () => { notifs = new Notifs(); });
cds = new Cards(pList);

info = JSON.parse(decodeURIComponent(atob(new URL(window.location.href).searchParams.get('i'))));
var turn = !!(new URL(window.location.href).searchParams.get('turn'));
var iceServers;
if (turn) {
	iceServers = await new Promise(r => {
		const req = new XMLHttpRequest();
		req.addEventListener('load', function() {
			r(JSON.parse(this.responseText));
		});
		req.open('GET', 'https://rowan.metered.live/api/v1/turn/credentials?apiKey=92b29d86913fe54ddcd66c3e16a7ce88adad');
		req.send();
	});
} else {
	iceServers = [{
        urls: "stun:stun.relay.metered.ca:80"
    }];
}

const peer = new Peer({
	host: window.location.hostname,
	port: 443,
	path: "/peer/server",
	config: {
		iceServers
	}
});

function post(url, data) {
	return new Promise(r => {
		const req = new XMLHttpRequest();
		req.open('POST', url, true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function() {
			r(this.responseText);
		});
		req.send(JSON.stringify(data));
	});
}
function http(url) {
	return new Promise(r => {
		const req = new XMLHttpRequest();
		req.open('GET', url);
		req.addEventListener('load', function() {
			r(this.responseText);
		});
		req.send();
	});
}

peer.on('open', async id => {
	// Pre-game
	const apId = await http('/api/id');
	console.log(apId);
	evt = new EventSource(`/api/ev?id=${apId}`);
	await new Promise(r => { evt.addEventListener('open', r); });
	document.querySelector('title').innerText = `Hosting ${info.name}`;
	const log = document.querySelector('div#log');
	evt.addEventListener('err', err => {
		notifs.error(err.data);
		notifs.info('Reloading in 5 seconds');
		setTimeout(() => { window.location.reload(); }, 5000);
	});
	post('/api/host', {
		apId,
		id,
		name: info.name,
		turn: turn,
		encrypted: false
	});
	await new Promise(r => { evt.addEventListener('ok', r); });
	console.log(id);
	notifs.info('Room registered');
	peer.on('error', err => {
		notifs.error(err.message);
	});
	
	peer.on('connection', conn => {
		console.log(conn.peer);
		conn.on('close', () => {
			cds.remove(conn);
		});
		conn.on('error', err => {
			notifs.error(err.message);
		});
		conn.on('data', d => {
			console.log(d);
			cds.handle(d, conn);
		});
	});
	
	var joinUrl = new URL(window.location.href);
	joinUrl.pathname = '/join';
	joinUrl.search = `?id=${id}` + (turn ? '&turn=1' : '');
	joinUrl = joinUrl.href;
	joinAsPeer = () => window.open(joinUrl, '_blank');
	copyJoinLink = () => {
		navigator.clipboard.writeText(joinUrl);
	}
	// Load packs
	await loadPacks(info.packs);
	notifs.info('Room ready');
});

start = () => {
	evt.close();
	cds.deal();
	console.log([...pList.values()]);
}
})();