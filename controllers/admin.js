const path = require('path');
const mongodb = require('mongodb');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            prods: products,
            path: '/admin/products'
        });
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price, req.user._id);
    product
    .save()
    .then(result => {
        console.log('Product created');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const productId = req.params.id;
    if (!editMode) {
        res.redirect('/');
    }

    Product.findById(productId).then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
}

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.id, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product
        .save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));    
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.deleteById(id).then(() => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}