const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { AuthRouter } = require('./Routers/Auth');
const { MenuRouter } = require('./Routers/MenuItem');
const { apiRouter } = require('./Routers/api');
const { authMiddleware } = require('./Middleware/authMiddleware');
const { authAdminMiddleware } = require('./Middleware/authAdminMiddleware');
const AdminAuth = require('./Routers/AdminAuth');
const DashboardRouter = require('./Routers/DashboardStats');
const { UserRouter } = require('./Routers/UserRouter');
const { AnalyticsRouter } = require('./Routers/AnalyticsRouter');
const { AddItemRouter } = require('./Routers/AddItemRouter');
const { PymentRouter } = require('./Routers/PymentRouter');
const { OfferRouter } = require('./Routers/OfferRouter');

const { ConnectDB } = require("./DataBase/configDB");
const { EmailRouter } = require('./Routers/EmailRouter');

require("dotenv").config();

ConnectDB(process.env.MONGO_URI);




const app = express();
const PORT = process.env.PORT || 3000
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(cors({
    // origin: 'http://localhost:5173',
    origin: 'https://canteenease84k.onrender.com',
    credentials: true
}));


app.use('/Auth', AuthRouter);
app.use('/admin', AdminAuth);
app.use('/api/admin', DashboardRouter);
app.use('/', MenuRouter);
app.use('/api', apiRouter);
app.use('/api/users', UserRouter);
app.use('/analytics', AnalyticsRouter);
app.use('/api/add-item', AddItemRouter);
app.use('/api/orders/', PymentRouter);
app.use('/admin', OfferRouter);
app.use('/api/send-email', EmailRouter);

app.get('/api/verify', authMiddleware, (req, res) => {
    return res.json({ message: 'Token Verified!', user: req.user });
});

app.get('/api/admin/verify', authAdminMiddleware, (req, res) => {
    return res.json({ message: 'Token Verified!', user: req.user });
});

app.get('/', (req, res) => {
    res.send("<h1>Server is runing....</h1>");
})
app.listen(PORT, () => {
    console.log(`Server Started PORT : http://localhost:${PORT}`);
});
