var pckIds = [];
function getId() {
	var id;
	do {
		id = (Math.random() + 1).toString(36).substring(7);
	} while (pckIds.includes(id));
	pckIds.push(id);
	return id;
}
function logLog(txt, html = false) {
	const log = document.querySelector('div#log');
	var id = getId();
	var l = document.createElement('p');
	l.dataset.id = id;
	if (log) {
		log.appendChild(l);
		l = log.querySelector(`[data-id="${id}"]`);
	}
	if (html) l.innerHTML = txt;
	else l.innerText = txt;
	return l;
}
function remLog(l) {
	pckIds.splice(pckIds.indexOf(l.dataset.id), 1);
	l.remove();
}

var packs = false;
var cards = {
	white: [],
	black: []
}
var cardsLoaded = false;
var packsUse = ['cahbaseset.json'];
function getJSON(url, path = '') {
	var url = url + path;
	var l = logLog(`Loading ${path}`);
	return new Promise(r => {
		const http = new XMLHttpRequest();
		http.addEventListener('load', function() {
			remLog(l);
			r(JSON.parse(this.responseText));
		});
		http.open('GET', url);
		http.send();
	});
}
async function loadPacks(pcks = false) {
	const MAIN = 'https://cdn.jsdelivr.net/gh/cookey-dev/cah-cards@main/main.json';
	const BASE = 'https://cdn.jsdelivr.net/gh/cookey-dev/cah-cards@main/packs/';
	if (!packs) packs = await getJSON(MAIN);
	console.log(packs);
	if (pcks) {
		var cds = await Promise.all(pcks.map(p => getJSON(BASE, p)));
		console.log(cds);
		logLog(`Loaded ${cds.length} packs`);
		var l = logLog('Concatenating packs');
		for (var c of cds) {
			l.innerText = `Concatenating ${c.name}`;
			cards.white = cards.white.concat(c.white);
			cards.black = cards.black.concat(c.black);
		}
		l.innerText = `Concatenated ${cds.length} packs`;
		l = logLog('Clearing duplicates');
		var len = cards.white.length + cards.black.length;
		cards.white = [...new Set(cards.white)];
		cards.black = [...new Set(cards.black)];
		var nLen = cards.white.length + cards.black.length;
		l.innerText = `Removed ${len - nLen} duplicates`;
		logLog(`Loaded:<br>${pcks.length} packs<br>${cards.white.length} white cards<br>And ${cards.black.length} black cards`, true);
		console.log(cards);
		cardsLoaded = true;
	}
}
