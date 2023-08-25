var joinAsPeer;
var copyJoinLink;
(async () => {
var info;

var notifs;
window.onload = () => {
	notifs = new Notifs();
}
const cds = new Cards(pList);
const sock = io();

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
	
peer.on('open', async id => {
	notifs.info('Room open');
	// Pre-game
	document.querySelector('title').innerText = `Hosting ${info.name}`;
	const log = document.querySelector('div#log');
	
	sock.on('error', err => {
		alert(err);
		window.location.reload();
	});
	console.log(id);
	sock.emit('host', {
		id,
		name: info.name,
		turn: turn,
		encrypted: false
	});
	
	peer.on('connection', conn => {
		console.log(conn.peer);
		conn.on('close', () => {
			cds.remove(conn);
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
});

function start() {
	sock.close();
	cds.deal();
	console.log([...pList.values()]);
}
})();