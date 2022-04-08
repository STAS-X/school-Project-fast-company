const express=require('express');
const config = require('config');
const chalk = require('chalk');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const mongoose = require('mongoose');
const { initDb } = require('./startUp/initDatabase');

const app=express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', routes);


const PORT = config.get('port') || 3000;

if (process.env.NODE_ENV === 'production') {
    console.log(chalk.red('This is production mode'));
    app.use('/', express.static(path.join(__dirname,'client')));

    const indexPath = path.join(__dirname, 'client', 'index.html');
    app.get('*', (req, res) => {
        res.sendFile(indexPath);
    })
} else 
    console.log(chalk.blue('This is development mode'));

async function start() {
    try {

        mongoose.connection.once('open', ()=>{
            initDb();
        });
        mongoose.connect(config.get('mongoUri'), {
					// useNewUrlParser: true,
					// useUnifiedTopology: true,
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