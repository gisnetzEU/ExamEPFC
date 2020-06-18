const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
app.use(express.static('public'));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`listen on port ${port}`));

new MongoClient('mongodb://localhost:27017').connect((error, client) => {
    if (error) {
        console.error(`Pas de connexion à la DB\n${error}`);
        return error;
    }
    console.log('connexion à mongodb OK');
    const userCollection = client.db('sales').collection('invoices');

    //facilité la traduction de HTTP => javascript
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json())

    //HTTP GET localhost:3000/invoices
    app.get('/invoices', (req, res) => {
        console.log('GET /invoices');
        userCollection.find().toArray((error, invoices) => {
            if (error) sendError(error, 'Le chargement des invoices a échoué');
            else {
                res.status(200);
                res.json(invoices);
            }
        });
    });

    /**
    * Enregistre une erreur et retourne le code 500 au client
    * @param {any} error : l'erreur, typiquement provenant de l'API
    * @param {*} msg : le message de l'application
    */
    function sendError(error, msg) {
        console.log(`${msg}\n${error}`);
        res.status(500);
        res.send();
    }

});
