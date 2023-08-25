const Database = require("@replit/database")
const db = new Database()
db.get("key").then(console.log)
