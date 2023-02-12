

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const util = require("util");
const db = require("./Develop/db/db.json");
const { json } = require("body-parser");
const { notDeepStrictEqual } = require("assert");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./Develop/public"));

app.get("/api/notes", function(req, res) {
    readFileAsync("./Develop/db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    });
});

app.post("/api/notes", function(req, res) {
    const noteInfo = req.body;
    readFileAsync("./Develop/db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        noteInfo.id = notes.length + 1;
        notes.push(noteInfo);
        return notes;
    }).then(function(notes) {
        writeFileAsync("./Develop/db/db.json", JSON.stringify(notes))
        res.json(noteInfo);
    });
});


app.delete('/api/note/:id' , (req, res) => {
    const  id  = req.params.id * 1;
    const deleted = notes.find(notes => notes.id === id)
    if(!deleted) {
        return res.status(404).json({
            status: 'fail',
            message: 'no Id found to delete'
        })
    }
    const index = notes.indexOf(deleted);
    notes.splice(index, 1);

    fs.writeFile('./Develop/db/db.json', JSON.stringify(notes), (err) =>{
        res.status(204).json({
            status: "success",
            data: {
                notes : null
            }

            
        })
    })


})


app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

app.listen(PORT, function() {
    console.log(`App listening at http://localhost:${PORT}`);
});
