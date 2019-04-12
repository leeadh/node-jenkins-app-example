const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

var server = app.listen(4000, () => {
    console.log("============")
    console.log("Listening on port " + server.address().port + "...");
    console.log("============")
});

module.exports = server;
