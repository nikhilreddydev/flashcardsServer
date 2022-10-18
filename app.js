const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI);

const cardSchema = new mongoose.Schema({
    front: String,
    back: String
})

const Card = mongoose.model("Card", cardSchema);

app.get("/", sendAllCards);

function sendAllCards(req, res) {
    Card.find(function(err, result) {
        if(!err)
            res.send(result);
        else console.log(err);
    });
}

app.post("/add", addNewCard);

function addNewCard(req, res) {
    let frontContent = req.body.front;
    let backContent = req.body.back;

    let card = new Card({front: frontContent, back: backContent});
    card.save();
    console.log("Added new card.");

    res.send({status: "success"});
}

app.patch("/edit", updateCard)

function updateCard(req, res) {
    let id = req.body._id;
    let frontContent = req.body.front;
    let backContent = req.body.back;

    Card.findByIdAndUpdate(id, {front: frontContent, back: backContent}, function(err, doc) {
        if(!err)
            console.log("Updated: " + id);
        else 
            console.log(err);
    });

    res.send({status: "success"});
}

app.delete("/delete", deleteCard);

function deleteCard(req, res) {
    let id = req.body._id;
    Card.findByIdAndRemove(id, function(err, docs) {
        if(!err)
            console.log("Deleted: " + id);
        else
            console.log(err);
    });

    res.send({status: "success"});
}

app.listen(process.env.PORT || port, function(err) {
    if(!err)
        console.log("App listening at port: ", port);
});