function getUsername(id, name) {
	return new Promise(r => {
		const cont = document.querySelector('div#pcont');
		const prompt = document.querySelector('div#prompt');
		const head = document.querySelector('h1#phead');
		const input = document.querySelector('input#pinput');
		const submit = document.querySelector('button#submit');
		input.value = name;
		input.addEventListener('keypress', ev => {
			if (ev.key.toLowerCase() == 'enter') {
				ev.preventDefault();
				submit.click();
			}
		});
		submit.onclick = () => {
			if (input.value.length < 1) {
				notifs.error('Username must be at least one character');
			} else if (!rooms) {
				notifs.warn('Rooms not loaded');
			} else if (!rooms.map(i => i.id).includes(id)) {
				notifs.error('Room doesn\'t exist');
			} else if (input.value == name) {
				notifs.error('Choose a different name');
			} else {
				r(input.value);
			}
		}
		cont.style.display = 'flex';
		if (cont.style.opacity != 1) cont.style.animation = 'show .3s linear forwards';
		input.focus();
	});
}

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
	console.log(id);
	var cds = new Cards();
	const conn = peer.connect(search.get('id'));
	await new Promise(r => conn.on('open', r));
	conn.on('data', d => {
		console.log(d);
		cds.handle(d, conn);
	});
	conn.send({
		type: 'name',
		name: decodeURIComponent(search.get('name'))
	});
});
})();