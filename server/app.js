const express=require('express');
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');
const routes = require('./routes');
const initDb = require('./startUp/initDatabase');

const app=express();

app.use(express.json);
app.use(express.urlencoded({extended: false}));

app.use('/api', routes);

const PORT = config.get('port') || 8080;

if (process.env.NODE_ENV === 'production') {
    console.log(chalk.red('This is production mode'));
} else 
    console.log(chalk.blue('This is development mode'));

async function start() {
    try {

        mongoose.connection.once('open', ()=>{
            initDb();
        });
        await mongoose.connect(config.get('mongoUri'));
        console.log(chalk.green(`MongoDB connect`));
        app.listen(PORT, () => {
					console.log(chalk.green(`Server has been starte on ${PORT} port`));
				});


    } catch(e) {
        console.log(chalk.red(e));
        process.exit(1);
    }
}

start();