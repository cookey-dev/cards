class Cards {
	pList;
	black;
	czarIdx;
	czar;
	constructor(pList) {
		this.pList = pList;
		this.czarIdx = 0;
		this.czar = null;
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
		return this.black;
	}
	broadcast(d) {
		for (var id of [...this.pList.keys()]) {
			this.pList.get(id).conn.send(d);
		}
	}
	broadcastExclude(d, exc) {
		for (var id of [...this.pList.keys()]) {
			if (!exc.includes(id)) this.pList.get(id).conn.send(d);
		}
	}
	broadcastTo(d, recp) {
		for (var id of recp) {
			this.pList.get(id).conn.send(d);
		}
	}
	deal() {
		for (var id of [...this.pList.keys()]) {
			this.pList.get(id).hand = [...Array(10)].map(() => this.getWhiteCard());
			this.pList.get(id).conn.send({
				type: 'deal',
				hand: this.pList.get(id).hand
			});
		}
	}
	remove(conn) {
		if (this.pList.get(conn.peer)) {
			this.pList.delete(conn.peer);
			updPList();
		}
	}
	idx2Id(idx) {
		if (this.pList.size < 1) notifs.error('Error converting index to id: No players')
		var id = null;
		for (var p of [...this.pList.values()]) {
			if (idx !== p.idx) continue;
			id = p.id;
			break;
		}
		return id;
	}
	getCzar() {
		var id = this.idx2Id(this.czarIdx);
		if (id == null) {
			this.czarIdx = 0;
			id = this.idx2Id(this.czarIdx);
		}
		if (id == null) notifs.error('Error finding czar in idx2Id, no players');
		return id;
	}
	pickCzar() {
		const id = this.getCzar();
		this.broadcastExc({
			type: 'info',
			info: `"${this.pList.get(id).name}" is now the Card Czar`
		}, [id]);
		this.pList.get(id).conn.send({
			type: 'czar'
		});
		this.broadcast({
			type: 'black',
			card: this.getBlackCard()
		});
	}
	handle(d, conn) {
		sw: switch (d.type) {
			case 'name':
				if (pListConflict(d, conn)) break;
				pList.set(conn.peer, {
					idx: pListIdx++,
					conn,
					id: conn.peer,
					name: d.name,
					hand: []
				});
				updPList();
				break;
			case 'white':
				break;
		}
	}
}
