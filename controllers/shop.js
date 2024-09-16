const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('shop/product-list', {
                    pageTitle: 'All Products',
                    prods: products,
                    path: '/products'
        });
    })
}

exports.getProductDetail = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        })
    })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(products => {
        res.render('shop/product-list', {
                    pageTitle: 'All Products',
                    prods: products,
                    path: '/products'
        });
    })
}

exports.getCart = (req, res, next) => {   
    req.user.getCart()
    .then(products => {
        res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products: products
        });
    }) 
    .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const productId = req.body.prodId;
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    req.user.deleteCartItem(id).then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrders = (req, res, next) => {
    req.user.addOrder()
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}