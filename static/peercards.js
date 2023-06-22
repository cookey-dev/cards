class Cards {
	black;
	hand;
	constructor() {
		this.hand = [];
	}
	deal(hand) {
		this.hand = hand;
		const handEl = document.querySelector('div#hand');
		for (var card of this.hand) {
			var el = document.createElement('div');
			var txt = document.createElement('p');
			el.className = 'card white';
			txt.innerText = card
			el.appendChild(txt);
		}
	}
	handle(d, conn) {
		if (d.type === 'deal') this.deal(d.hand);
	}
}