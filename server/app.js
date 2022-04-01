const express=require('express');
const config = require('config');
const chalk = require('chalk');
const routes = require('./routes');
const mongoose = require('mongoose');
const { initDb } = require('./startUp/initDatabase');

const app=express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = config.get('port') || 3000;

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
    console.log(chalk.red('This is production mode'));
} else 
    console.log(chalk.blue('This is development mode'));

async function start() {
    try {

        mongoose.connection.once('open', ()=>{
            initDb();
        });
        mongoose.connect(
					config.get('mongoUri'),
					{
						useNewUrlParser: true,
						useUnifiedTopology: true,
					});
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