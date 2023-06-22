window.onload = () => loadPacks().then(() => {
	const game = document.querySelector('div#game');
	const stats = document.querySelector('div#game > p#stats');
	stats.innerText = `Packs: ${packs.official.length} official, ${packs.unofficial.length} unofficial`;
});

const deconcat = (src, rem) => src.filter(it => !rem.includes(it));

function join() {
	window.location.pathname = '/join';
}

function base(el) {
	const sets = ['cahbaseset.json'];
	if (el.checked) packsUse = packsUse.concat(sets); // Duplicates will be removed later
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function fam(el) {
	const sets = ['cahfamilyeditionfreeprintplaypublicbeta.json'];
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function exp(el) {
	const sets = ['cahgreenboxexpansion.json', 'cahblueboxexpansion.json', 'cahredboxexpansion.json', 'cahfourthexpansion.json', 'cahsecondexpansion.json', 'cahthirdexpansion.json', 'cahsixthexpansion.json', 'cahfirstexpansion.json', 'cahboxexpansion.json', 'cahfifthexpansion.json', 'absurdboxexpansion.json'];
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function pck(el) {
	const sets = ['geekpack.json', 'sciencepack.json', 'cahcollegepack.json', 'theatrepack.json', 'rejectpack2.json', 'fantasypack.json', 'foodpack.json', 'tabletoppack.json', 'rejectpack3.json', 'periodpack.json', 'dadpack.json', 'masseffectpack.json', 'scifipack.json', 'cahhumanpack.json', 'worldwidewebpack.json', 'weedpack.json', 'pridepack.json', 'rejectpack.json', 'retailminipack.json', 'cahasspack.json', 'retailproductpack.json', 'jackwhiteshowpack.json', 'theatrepackcatsmusicalpack.json', 'fascismpack.json'];
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function pol(el) {
	const sets = ['cardsagainsthumanitysavesamericapack.json', 'votefortrumppack.json', 'voteforhillarypack.json', 'trumpbugoutbagposttrumppack.json', 'gencon2018midtermelectionpack.json'];
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function pax(el) {
	const sets = ['paxeast2014.json', 'paxeast2014panelcards.json', 'paxprime2013.json', 'pax2010oopskit.json', 'paxeast2013promopackb.json', 'paxprime2015foodpackbcoconut.json', 'paxprime2014panelcards.json', 'paxprime2015foodpackccherry.json', 'paxeast2013promopackc.json', 'paxeast2013promopacka.json', 'paxprime2015foodpackamango.json', 'paxprime2014customprintedcards.json'];
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function ai(el) {
	const sets = ['cahprocedurallygeneratedcards.json', 'cahaipack.json'];
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function oth(el) {
	const sets = ['cahukconversionkit.json', 'cah2000snostalgiapack.json', '2014holidaypack.json', 'houseofcardspack.json', 'jewpackchosenpeoplepack.json', '2012holidaypack.json', 'cahcanadianconversionkit.json', '2013holidaypack.json', '90snostalgiapack.json', 'seasonsgreetingspack.json', 'cahmaindeck.json', 'desertbusforhopepack.json', 'nerdbundleafewmorecardsforyounerdstargetexclusive.json', 'clickholegreetingcardspacktargetexclusive.json', 'cahhiddengemsbundleafewnewcardswecrammedintothisbundlepackamazonexclusive.json'];
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}
function unofficial(el) {
	const sets = packs.unofficial;
	if (el.checked) packsUse = packsUse.concat(sets);
	if (!el.checked) packsUse = deconcat(packsUse, sets);
}

function play() {
	document.querySelector('div#title').style.animation = 'hidetitle .2s linear forwards';
	setTimeout(() => {
		const game = document.querySelector('div#game');
		game.style.display = 'block';
		game.style.animation = 'showgame .2s linear forwards';
	}, 200);
}
function start() {
	if (packsUse.length < 1) {
		alert('You must select at least one pack');
		return;
	}
	const name = document.querySelector('input#name');
	if (name.value.length < 1) {
		alert('Name must be at least one character');
		return;
	}
	var info = {
		name: name.value,
		packs: packsUse
	}
	info = btoa(encodeURIComponent(JSON.stringify(info)));
	var url = new URL(window.location.href);
	url.pathname = '/host';
	url.search = `?i=${info}`;
	document.querySelector('div#game').style.animation = 'hidetitle .2s linear forwards';
	window.location.href = url.href;
}