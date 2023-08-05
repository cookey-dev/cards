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