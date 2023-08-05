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
peer.on('open', async id => {
	const search = new URL(window.location.href).searchParams;
	console.log(id);
	var cds = new Cards();
	const conn = peer.connect(search.get('id'));
	await new Promise(r => conn.on('open', r));
	conn.on('close', () => {
		alert('Kicked');
	});
	conn.on('data', d => {
		cds.handle(d, conn);
	});
	conn.send({
		type: 'name',
		name: decodeURIComponent(search.get('name'))
	});
});