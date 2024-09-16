const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class Product {
    constructor(id, title, imageUrl, description, price, userId) {
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.userId = userId;
    }

    save(){
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products')
                     .updateOne({_id: this._id}, {$set: this})
        } else {
            dbOp = db.collection('products').insertOne(this);            
        }

        return dbOp
               .then()
               .catch(err => console.log(err));
       
    }

    static fetchAll() {
        const db = getDb();
        return db
        .collection('products')
        .find()
        .toArray()
        .then((products) => {
            return products;
        })
        .catch(err => {
            console.log(err)
        });
    }

    static findById(id) {
        const db = getDb();
        return db
        .collection('products')
        .find({_id: new mongodb.ObjectId(id)})
        .next()
        .then((product) => {
            return product
        })
        .catch(err => {
            console.log(err)
        })
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
                .then()
                .catch(err => console.log(err));
    }
}











// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart');

// const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

// const getProductsFromFile = (cb) => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             return cb([]);
//         }
//         cb(JSON.parse(fileContent));
//     });
// }

// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     save() {
//         getProductsFromFile((products) => {
//             if (this.id) {
//                 const existingProductIndex = products.findIndex(p => p.id === this.id);
//                 const updatedProducts = [...products];
//                 updatedProducts[existingProductIndex] = this;
//                 fs.writeFile(p, JSON.stringify(updatedProducts), (err) =>  {
//                     console.log(err);
//                 });
//             } else {
//                 this.id = Math.random().toString();
//                 products.push(this);
//                 fs.writeFile(p, JSON.stringify(products), (err) =>  {
//                     console.log(err);
//                 });
//             }            
//         })       
        
//     }

//     static fetchAll(cb) {
//         getProductsFromFile(cb);
//     }

//     static fetchById(id, cb) {
//         getProductsFromFile((products) => {
//             const product = products.find(p => p.id === id);
//             return cb(product);
//         })
//     }

//     static deleteById(id, cb) {
//        getProductsFromFile((products) => {
//         const existingProductIndex = products.findIndex(p => p.id === id);
//         const existingProduct = products[existingProductIndex];
//         const updatedProducts = [...products];
//         updatedProducts.splice(existingProductIndex, 1);
//         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//             if(!err) {
//                 Cart.deleteProduct(id, existingProduct.price);
//             }
//         });
//        })
//     }
// }