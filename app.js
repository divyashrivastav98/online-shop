const path = require('path');
const pageNotFoundController = require('./controllers/404');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { mongoConnect } = require('./util/database');
const User = require('./models/user');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded());

app.use((req, res, next) => {
    User.findUserById('66e46f6b4c820211ed7d2615')
        .then(user => {
            req.user = new User(user._id, user.name, user.email, user.cart)
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pageNotFoundController.pageNotFound);

mongoConnect(() => {
    app.listen(3000);
})
