const mongoDb = require('mongodb');
const { getDb } = require("../util/database");

class User {
    constructor(id, username, email, cart) {
        this._id = id;
        this.username = username;
        this.email = email;
        this.cart = cart;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findUserById(id) {
        const db = getDb();
        return db
               .collection('users')
               .findOne({_id: new mongoDb.ObjectId(id)})
               .then((user) => {
                return user;
               })
               .catch(err => console.log(err));
    }

    addToCart(product) {
        const db = getDb();
        let updatedQty = 1;
        const updatedCartItems = [...this.cart.items];

        const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
        if (cartProductIndex > -1) {
            updatedQty = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = updatedQty;
        } else {
            updatedCartItems.push({productId: product._id, quantity: updatedQty});
        }
        const updatedCart = {items: updatedCartItems};
        return db
        .collection('users')
        .updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: {cart: updatedCart}})
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => i.productId);
        return db.collection('products').find({_id: {$in: productIds}})
        .toArray()
        .then(products => {
            return products.map(p => {
                return {
                    ...p,
                    quantity: this.cart.items.find(cp => cp.productId.toString() === p._id.toString()).quantity
                }
            })
        })
    }

    deleteCartItem(productId) {
        const db = getDb();
        const updatedCartItems = [...this.cart.items];
        const productIndex = updatedCartItems.findIndex(cp => cp.productId.toString() === productId.toString());
        if (productIndex > -1) {
            updatedCartItems.splice(productIndex, 1);
        }
        const updatedCart = {items: updatedCartItems};
        return db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)}, {$set: {cart: updatedCart}})
    }

    addOrder() {
        const db = getDb();
        return db.collection('orders').insertOne(this.cart).then(result => {
            this.cart = [];
            return db.collection('users').updateOne({id: new mongoDb.ObjectId(this._id)}, {$set : {items: []}})
        })
    }

    getOrders() {
        const db = getDb();
        // db.collection('orders').find({_})
    }
}

module.exports = User;