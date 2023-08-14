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