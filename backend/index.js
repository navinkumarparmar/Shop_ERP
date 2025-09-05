const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 3000
const path = require("path");
const bodyparser =  require('body-parser');
const Database = require('./config/db');
Database();
app.use(cors({
  origin: true,   
  credentials: true,  
}));
const routes = require('./routes/index');

const errorHandler = require('./middlwere/errorHandler');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use('/api',routes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

app.use(errorHandler)
app.get('/',(req,res,next)=>{
    res.send('server is running')
})

app.listen(PORT,()=>{
    console.log(`your server is running on port ${PORT}`);
})
