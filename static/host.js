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
      		}
  		],
	}
});

var info;

var joinAsPeer;
var copyJoinLink;
const cds = new Cards(pList);
const sock = io();

peer.on('open', async id => {
	// Pre-game
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
		console.log(conn.peer);
		conn.on('close', () => {
			if (pList.get(conn.peer)) {
				pList.delete(conn.peer);
				updPList();
			}
		});
		conn.on('data', d => {
			console.log(d);
			cds.handle(d, conn);
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

	// Load packs
	log.innerText = 'Loading packs'
	await loadPacks(info.packs, log);
});

function start() {
	sock.close();
	cds.deal();
	console.log([...pList.values()]);
}