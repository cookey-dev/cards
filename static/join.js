var rooms = null;

function getUsername(id) {
	return new Promise(r => {
		const cont = document.querySelector('div#pcont');
		const prompt = document.querySelector('div#prompt');
		const head = document.querySelector('h1#phead');
		const input = document.querySelector('input#pinput');
		const submit = document.querySelector('button#submit');
		head.innerText = 'Username';
		input.addEventListener('keypress', ev => {
			if (ev.key.toLowerCase() == 'enter') {
				ev.preventDefault();
				submit.click();
			}
		})
		submit.onclick = () => {
			if (input.value.length < 1) {
				alert('Username must be at least one character');
			} else if (!rooms) {
				alert('Rooms not loaded');
			} else if (!rooms.map(i => i.id).includes(id)) {
				alert('Room doesn\'t exist');
			} else {
				r(input.value);
			}
		}
		cont.style.display = 'flex';
		if (cont.style.opacity != 1) cont.style.animation = 'show .3s linear forwards';
		input.focus();
	});
}

function join() {
	var url = new URL(window.location.href);
	url.pathname = '/peer';
	if (this.encrypted) {
	} else {
		getUsername(this.id).then(user => {
			url.search = `?id=${encodeURIComponent(this.id)}&name=${encodeURIComponent(user)}`;
			window.location.href = url.href;
		});
	}
}

function updRooms(rooms, rList) {
	rList.innerText = '';
	for (var r of rooms) {
		var li = document.createElement('li');
		var name = document.createTextNode(r.name);
		var lock = document.createElement('i');
		lock.className = `fa-solid fa-${r.encrypted ? '' : 'un'}lock`;
		li.appendChild(name);
		li.appendChild(lock);
		li.onclick = join.bind(r);
		rList.appendChild(li);
	}
}

window.onload = async () => {
	var url = new URL(window.location.href).searchParams;
	rooms = (await getJSON('/api/rooms')).rooms;
	if (url.get('id')) join.bind({
		encrypted: false,
		id: url.get('id')
	})(rooms);
	const rList = document.querySelector('ul#rooms');
	const search = document.querySelector('input#name');
	updRooms(rooms, rList);
	search.addEventListener('input', e => {
		console.log(e.target.value);
		updRooms(rooms.filter(r => r.name.startsWith(e.target.value)), rList);
	});
}