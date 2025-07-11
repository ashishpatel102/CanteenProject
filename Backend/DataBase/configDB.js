const mongoose = require('mongoose');

async function ConnectDB(url) {
    try {
        await mongoose.connect(url)
        .then(()=> console.log("✔️ DataBase Connected !"))        
    } catch (error) {
        console.log("error DataBase Connection"+error);
    }
}

module.exports = {ConnectDB};