const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../models/Users');
const { db } = require('../models/Users');


//Check login
router.post('/',(req,res) => {
    try {
        Users.findOne({'account':req.body.account,'password': req.body.password }).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(!res2) {
                    res.send(JSON.parse(`{
                        "text": "登入失敗！",
                        "account":"NULL"
                    }`));
                    return;
                }
                res.send(JSON.parse(`{
                    "text": "Hello ${res2.name}！",
                    "account":"${res2.account}"
                }`));
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

//check repeat account
router.post('/checkaccount',(req,res) => {
    try {
        Users.findOne({ "account":req.body.account}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(res2 === null){
                    res.status(200).send({ enroll: true });   
                }
                else{
                    res.status(200).send({ enroll: false });
                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
});


//store enroll data
router.post('/enroll',async(req,res) => {
    const users = new Users({
        account:req.body.account,
        password:req.body.password,
        name:req.body.name,
        icon:req.body.icon,
        gender:req.body.gender,
        birthday:req.body.birthday,
        mail:req.body.mail
    });
    try {
        const savePost = await users.save();
        res.json(savePost);
    }catch(err){
        res.json({message:err});
    }
    res.send({ account: req.body.account });
});

//store fb login data
router.post('/CheckData',(req,res) => {
    try {
        //console.log(req.body.account);
         Users.findOne({ "account":req.body.account}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err);
                return;
            }
            else{
                if(res2 == null){
                    const users = new Users({
                        account:req.body.account,
                        password:req.body.password,
                        name:req.body.name,
                        phone:req.body.phone,
                        icon:req.body.url
                    });
                   users.save();
                    res.send(JSON.parse(`{
                        "first": "true"
                    }`));
                }
                else{
                    Users.findOneAndUpdate({ account: res2.account }, { icon: req.body.url }, err => {
                        console.log(err)
                    });
                    res.send(JSON.parse(`{
                        "first": "false"
                    }`));
                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
    //res.status(200).send({ isSuccess: true });
});

//store class info
router.post('/createclass',async(req,res) => {
    try {
        await Users.findOne({ "account":req.body.account}).exec(async (err, res) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res.classcode = req.body.classcode;
                res.nickname = req.body.nickname;
                res.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }catch(err){
        res.json({message:err});
    }
    res.status(200).send({ isSuccess: true });
});

//get specific user info
router.get('/find/:id',async(req,res) => {
    try {
        await Users.findOne({ "account":req.params.id}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                res.send(res2);
            }
        });
    }catch(err){
        res.json({message:err});
    }
});

//get same classcode user data
router.get('/:id',async(req,res) => {
    try {
        await Users.find({ "classcode":req.params.id}).exec(async (err, res2) => {
            if (err) {
                console.log('fail to query:', err)
                return;
            }
            else{
                if(res2 == null){
                    res.send("null");   
                }
                else{
                    res.send(res2);
                }
            }
        });
    }catch(err){
        res.json({message:err});
    }
});
// for users to edit their personal information
router.post('/changedata',(req,res) => {
    var id = (req.body.id);
    console.log(req.body.gender);
    Users.findOneAndUpdate({ account:id}, { 
        icon:req.body.icon,
        name:req.body.name,
        mail:req.body.mail,
        gender:req.body.gender,
        birthday:req.body.birthday
    }, err => {
        console.log(err);
        if (!err) {
            res.status(200).send({ isSuccess: true });
        } else {
            res.status(503).send({ isSuccess: false });
        }
    });
});
module.exports = router;
