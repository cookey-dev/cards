const Database = require("@replit/database");
const db = new Database();
db.list().then(ks => {
	const len = ks.length;
	Promise.all(ks.map(k => db.delete(k))).then(() => {
		console.log(`Deleted ${len} keys`);
		process.exit();
	});
});
