var cds;
(async () => {
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
	const search = new URL(window.location.href).searchParams;
	const name = decodeURIComponent(search.get('name'));
	console.log(id);
	const conn = peer.connect(search.get('id'));
	await new Promise(r => conn.on('open', r));
	cds = new Cards(peer, conn);
	conn.on('error', err => {
		notifs.error(err.message);
	});
	conn.on('data', async d => {
		console.log(d);
		await cds.handle(d, conn);
	});
	cds.setName(name);
});
})();