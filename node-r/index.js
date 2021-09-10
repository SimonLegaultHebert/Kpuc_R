const express = require('express');
const app = express();
const R = require('r-script');
const bodyParser = require('body-parser')
const fs = require("fs");
var cors = require('cors'); // à retirer sur le serveur potentiellement

app.use(bodyParser.json());
app.use(cors());

const FILE_DIR = 'data/';
const SCRIPT_R = 'run-predictions.R';

// -------------------------------------------- routes
app.get('/download', function (req, res) {
    var fileName = req.query.fileName;
    const file = `${FILE_DIR}/${fileName}`;
    res.download(file);
});

app.get('/results', function (req, res) {
    var fileName = req.query.fileName;
    const file = `${FILE_DIR}${fileName}`;
    const content = fs.readFileSync(file);
    return res.status(200).send(tsvJSON(content.toString()));
});

app.post('/predictions', function (req, res) {
    if (evaluatePredictionsRequestBody(req.body)) {
        var result = R(`${FILE_DIR}${SCRIPT_R}`).data({ chromosome: req.body.chromosome, startPosition: req.body.startPosition, stopPosition: req.body.stopPosition, type: req.body.type }).callSync();
        return res.status(200).send(result);
    } else {
        return res.status(500).send('Error with request body');
    }
});

function tsvJSON(tsv) {
    return tsv
        .replace(/\"/g, '')
        .split('\n')
        .map(line => line.split('\t'))
        .reduce((a, c, i, d) => {
            if (i) {
                const item = Object.fromEntries(c.map((val, j) => [d[0][j], val]))
                return a ? [...a, item] : [item]
            }
        }, [])
}

function evaluatePredictionsRequestBody(requestBody) {
    if (!requestBody.chromosome || !requestBody.startPosition || !requestBody.stopPosition || !requestBody.type) {
        return false;
    }
    return true;
}

// -------------------------------------------- Server Start
const server = app.listen(8082, function () {
    const port = server.address().port;
    console.log(`App listening at http://localhost:${port}`);
});