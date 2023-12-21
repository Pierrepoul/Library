const express = require('express');
const bodyParser = require("body-parser")
const http = require('http');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();


const app = express();
const PORT = 3000;
const db_name = path.join(__dirname, "db.sqlite");
const db = new sqlite3.Database(db_name, err => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connexion to database successful:  'db.sqlite'");
    db.run("CREATE TABLE IF NOT EXISTS Book (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, grade TEXT, last_update TEXT);", err => {
        if (err) {
            console.error(err.message);
        }
    });
});
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});
app.post("/add", (req, res) => {
    let sqlAddRequest = `INSERT INTO Book (title, author, grade, last_update) VALUES ('${req.body.title}', '${req.body.author}', '${req.body.grade}', date())`;
    db.run(sqlAddRequest, err => {
        if (err) {
            console.error(err.message);
        }
        else {
            const sqlSelect = `SELECT * FROM Book ORDER BY ID DESC LIMIT 1`;
            db.all(sqlSelect, [], (err, book) => {
                if (err) {
                    console.error(err.message);
                }
                else {
                    res.status(200).json(book[0]);
                }
            });
        }
    });

});
app.post("/delete", (req, res) => {
    const sql = `DELETE FROM Book WHERE id = ${req.body.id};`;
    db.run(sql, [], err => {
        if (err) {
            return console.error(err.message);
        }
        else {
            const sql_all = "SELECT * FROM Book ORDER BY id";
            db.all(sql_all, [], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    res.status(200).json(rows);
                }
            });
        }
    });

});
app.post("/edit", (req, res) => {
    const sql = `UPDATE Book SET title = '${req.body.title}', author = '${req.body.author}', grade = '${req.body.grade}', last_update=date() WHERE (id = ${req.body.id})`;
    db.run(sql, [], (err, book) => {
        if (err) {
            console.log(err);
        }
        else {
            const sqlSelect = `SELECT * FROM Book WHERE (id = ${req.body.id})`;
            db.all(sqlSelect, [], (err, book) => {
                if (err) {
                    console.error(err.message);
                }
                else {
                    res.status(200).json(book[0]);
                }
            });
        }
    });
});

app.get("/refresh", (req, res) => {
    const sql = "SELECT * FROM Book ORDER BY id";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        else {
            res.status(200).json(rows);
        }
    });

});

const server = http.createServer(app);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + PORT;
    console.log('Listening on ' + bind);
});

server.listen(PORT);
