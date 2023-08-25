const pList = new Map();
function rmPList(id) {
	pList.get(id).conn.close();
	pList.delete(id);
	updPList();
}
function pListKick(id) {
	const conn = pList.get(id).conn;
	const cont = document.querySelector('div#pcont');
	const prompt = document.querySelector('div#prompt');
	const head = document.querySelector('h1#phead');
	const input = document.querySelector('input#pinput');
	const submit = document.querySelector('button#submit');
	head.innerText = `Kick ${pList.get(id).name}`;
	input.addEventListener('keypress', ev => {
		if (ev.key.toLowerCase() == 'enter') {
			ev.preventDefault();
			submit.click();
		}
	});
	submit.onclick = () => {
		conn.send({
			type: 'kick',
			reason: input.value || 'Reason not given'
		});
		pList.delete(id);
		updPList();
		setTimeout(() => {
			conn.close();
		}, 10000);
		cont.style.animation = 'hide .3s linear forwards';
		setTimeout(() => {
			cont.style.display = 'none';
		}, 300);
	}
	cont.style.display = 'flex';
	if (cont.style.opacity != 1) cont.style.animation = 'show .3s linear forwards';
	input.focus();
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
			pListKick(p.id);
		}
		btn.innerText = 'Kick'
		e.appendChild(txt);
		e.appendChild(btn);
		el.appendChild(e);
	}
}
function pListConflict(d, conn) {
	if (pList.get(conn.peer)) {
		conn.send({
			type: 'sys_kick',
			reason: 'Conflicting id (Internal error)'
		});
		conn.close();
		return true;
	} else if ([...pList.values()].map(p => p.name).includes(d.name)) {
		conn.send({
			type: 'name_conflict'
		});
		return true;
	} else if (d.name == 'dev_kicktest') {
		console.log('kicktest');
		console.log(conn.peer);
		conn.send({
			type: 'sys_kick',
			reason: 'get kicked bogo'
		});
		return true;
	}
	conn.send({
		type: 'info',
		info: 'Connected successfully'
	});
	return false;
}