const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const server = express();
const port = 3000;

server.listen(port, () => {
  console.log("Servern är igång!");
});

server.use(express.json());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

const db = new sqlite3.Database("./gik339.db");
const CreateTableCar = `
CREATE TABLE IF NOT EXISTS cars(
id INTEGER PRIMARY KEY AUTOINCRAMENT,
märke TEXT NOT NULL,
modell TEXT NOT NULL,
årsmodell INTEGER NOT NULL,
färg TEXT)`;

db.run(CreateTableCar, (e) => {
  if (e) {
    console.log("Kunde inte skapa tabell");
  } else {
    console.log("Tabellen 'cars' är redo!");
  }
});

server.get("/cars", (req, res) => {
  const sql = "SELECT* FROM cars";
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send(rows);
    }
  });
});

server.post("/cars", (req, res) => {
  const car = req.body;
  const sql = `INSERT INTO cars(
    märke,
    modell,
    årsmodell,
    färg) 
    Values (?,?,?,?)`;
  db.run(sql, [car.märke, car.modell, car.årsmodell, car.färg], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send({
        message: "Bilen har registrerats i databasen!",
        id: this.lastID,
      });
    }
  });
});
