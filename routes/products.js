const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Products = require('../models/product');
const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Products.find(req.query)
        .then((Products) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(Products)
        }, (err) => next(err))
        .catch((err) => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Products.create(req.body)
        .then((product) => {
            console.log('Product Created ', product);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported here");
        
    })

    .delete(cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Products.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));  
    });

productRouter.route('/:proId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Products.findById(req.params.proId)
        .populate('comments.author')
        .then((product) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        res.statusCode = 403;
        res.end("Post operation not supported here");
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
        Products.findByIdAndUpdate(req.params.proId, {
            $set: req.body
        }, { new: true })
        .then((product) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions,  authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Products.findByIdAndRemove(req.params.proId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    });

module.exports = productRouter;
