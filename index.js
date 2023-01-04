const express = require("express");
const bodyParser = require("body-parser");
const Server = require('http');
const createServer = Server.createServer;
const mongoConnect = require('./database/mongoConnect').mongoConnect;

const authRoutes = require("./routes/auth/auth-routes");
const adminRoutes = require("./routes/admin/admin-routes");

const userRoutes = require("./routes/user/user-routes");


const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const PORT = 7000;
require("dotenv").config();


app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/users", userRoutes);



mongoConnect(() => {
    app.listen(PORT);
})