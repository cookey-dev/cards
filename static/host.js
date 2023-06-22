const peer = new Peer({
	host: window.location.hostname,
	port: 443,
	path: "/peer/server",
	config: {
		iceServers: [
      		{
        		urls: "stun:a.relay.metered.ca:80",
      		},
      		{
        		urls: "turn:a.relay.metered.ca:80",
        		username: "127830d23d52b2e9695b8315",
        		credential: "9pgi6e1b428bcz55",
      		},
      		{
        		urls: "turn:a.relay.metered.ca:80?transport=tcp",
       			username: "127830d23d52b2e9695b8315",
        		credential: "9pgi6e1b428bcz55",
      		},
      		{
        		urls: "turn:a.relay.metered.ca:443",
        		username: "127830d23d52b2e9695b8315",
        		credential: "9pgi6e1b428bcz55",
      		},
      		{
        		urls: "turn:a.relay.metered.ca:443?transport=tcp",
        		username: "127830d23d52b2e9695b8315",
        		credential: "9pgi6e1b428bcz55",
      		},
  		],
	}
});

var info;

const pList = new Map();
function rmPList(id) {
	pList.get(id).conn.close();
}
function updPList() {
	const el = document.querySelector('ul#plist');
	el.textContent = '';
	if ([...pList.values()].length < 1) {
		var e = document.createElement('li');
		var txt = document.createTextNode('Empty :(');
		e.appendChild(txt);
		el.appendChild(e);
	}
	for (var p of [...pList.values()]) {
		var e = document.createElement('li');
		var txt = document.createTextNode(p.name);
		var btn = document.createElement('button');
		btn.className = 'kick';
		btn.onclick = () => {
			rmPList(p.id);
		}
		btn.innerText = 'Kick'
		e.appendChild(txt);
		e.appendChild(btn);
		el.appendChild(e);
	}
}

var joinAsPeer;
var copyJoinLink;
const cds = new Cards(pList);
const sock = io();

peer.on('open', async id => {
	info = JSON.parse(decodeURIComponent(atob(new URL(window.location.href).searchParams.get('i'))));
	document.querySelector('title').innerText = `Hosting ${info.name}`;
	const log = document.querySelector('p#info');
	sock.on('error', err => {
		alert(err);
		window.location.reload();
	});
	console.log(id);
	sock.emit('host', {
		id,
		name: info.name,
		encrypted: false
	});
	peer.on('connection', conn => {
		var init = false;
		console.log(conn.peer);
		conn.on('close', () => {
			if (pList.get(conn.peer)) {
				pList.delete(conn.peer);
				updPList();
			}
		});
		conn.on('data', d => {
			console.log(d);
			if (!init && d.name) {
				init = true;
				pList.set(conn.peer, {
					conn,
					id: conn.peer,
					name: d.name,
					hand: []
				});
				updPList();
			} else {
				cds.handle(d, conn);
			}
		});
	});
	var joinUrl = new URL(window.location.href);
	joinUrl.pathname = '/join';
	joinUrl.search = `?id=${id}`;
	joinUrl = joinUrl.href;
	joinAsPeer = () => window.open(joinUrl, '_blank');
	copyJoinLink = () => {
		navigator.clipboard.writeText(joinUrl);
	}
	log.innerText = 'Loading packs'
	await loadPacks(info.packs, log);
});

function start() {
	sock.close();
	cds.deal();
	console.log([...pList.values()]);
}