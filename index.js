const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser')
const admin = require('firebase-admin');
const serviceAccount = require("./manage-watch-sales-firebase-adminsdk-kp5kx-e042c6cbad.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://manage-watch-sales.firebaseio.com"
});
var db = admin.firestore();
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/watch', async(req, res)=>{
    //let id = req.body.id;
    let data = {
        name: req.body.name,
        amount: req.body.amount,
        photoURL: req.body.photoURL,
        price: req.body.price,
        sex: req.body.sex,
    }
    console.log(req.body)
    let query = await db.collection("Watchs").doc().set(data).then(()=>{
        res.status(200).send({mess : "Ok Done"});
    }).catch(()=>{
        res.status(400).send( {mess : "Oh no!!!"});
    });
  
})

app.put('/watch', async (req, res)=>{
    let id = req.body.id;
    let data = {
        name: req.body.name,
        amount: req.body.amount,
        photo: req.body.photo,
        price: req.body.price,
        sex: req.body.sex,
    };
    //console.log(req.body)
    let query = db.collection("Watchs").doc(id);
    await query.get().then((snapshot)=>{
        if(!snapshot.exists)
        {
            console.log("khong ton tai");
            res.status(400).send({mess : "Oh no!!!"});
        }
        else{
            console.log("ton tai");
            query.set(data).then(()=>{
                res.status(200).send({mess : "Ok Done"});
            });
        }
    })
})

app.delete('/watch', async (req, res)=>{
    let id = req.body.id;
    let query = await db.collection("Watchs").doc(id).delete().then(()=>{
        res.status(200).send({mess : "Ok Done"});
    }).catch(()=>{
        res.status(400).send({mess : "Oh no!!!"});
    })
})

// db.collection('Watchs').doc('5XGEpMDtvb3KmGNLwKns').get().then((data)=>{console.log(data.data())})

app.listen(PORT, ()=>{console.log("listen in port", PORT)})