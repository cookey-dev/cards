class Cards {
	pList;
	black;
	czar;
	constructor(pList) {
		this.pList = pList;
	}
	getWhiteCard() {
		const idx = Math.floor(Math.random() * cards.white.length);
		const card = cards.white[idx];
		cards.white.splice(idx, 1);
		return card;
	}
	getBlackCard() {
		const idx = Math.floor(Math.random() * cards.black.length);
		const card = cards.black[idx];
		cards.black.splice(idx, 1);
		this.black = card;
	}
	deal() {
		for (var id of [...this.pList.keys()]) {
			this.pList.get(id).hand = [...Array(10)].map(i => this.getWhiteCard());
			this.pList.get(id).conn.send({
				type: 'deal',
				hand: this.pList.get(id).hand
			});
		}
	}
	handle(d, conn) {
		
	}
}