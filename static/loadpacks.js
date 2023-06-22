var packs = {};
var cards = {
	white: [],
	black: []
}
var cardsLoaded = false;
var packsUse = ['cahbaseset.json'];
function getJSON(url) {
	return new Promise(r => {
		const http = new XMLHttpRequest();
		http.addEventListener('load', function() {
			r(JSON.parse(this.responseText));
		});
		http.open('GET', url);
		http.send();
	});
}
async function loadPacks(pcks = false, log = false) {
	const MAIN = 'https://cdn.jsdelivr.net/gh/cookey-dev/cah-cards@main/main.json';
	const BASE = 'https://cdn.jsdelivr.net/gh/cookey-dev/cah-cards@main/packs/';
	packs = await getJSON(MAIN);
	console.log(packs);
	if (pcks) {
		for (var p of pcks) {
			log.innerText = `Loading ${p}`;
			var c = await getJSON(BASE + p);
			cards.white = cards.white.concat(c.white);
			cards.black = cards.black.concat(c.black);
		}
		cards.white = [...new Set(cards.white)];
		cards.black = [...new Set(cards.black)];
		console.log(cards);
		log.innerHTML = `Loaded:<br>${pcks.length} packs<br>${cards.white.length} white cards<br>And ${cards.black.length} black cards`;
		cardsLoaded = true;
	}
}
