const express = require('express');
const bodyParser = require('body-parser');
const Redis = require("ioredis")
const cors = require('cors');
require('dotenv/config');
const tuf = require("./models/database");

const app = express();
const port = 3001;

// let submissions = [];
let flag = 0;

const redisClient = new Redis({
    host: 'redis-11150278-rishabh.a.aivencloud.com',
    port: 21308,
    username: 'default',
    password: 'AVNS_ieYi7TdZvY0J4mJ6LN-',
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
    // Add your error handling logic here
});

app.use(cors({
    allowedHeaders: ['*'],
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const getAsync = redisClient.get.bind(redisClient);
const setexAsync = redisClient.setex.bind(redisClient);


app.post('/submit-form', async (req, res) => {
    const { username, codeLanguage, stdin, sourceCode } = req.body;
    console.log(req.body)
    // const timestamp = new Date().toISOString();

    try {
        const connection = await tuf.getConnection();
        await connection.query('INSERT INTO formdata (username, codeLanguage, stdin, sourceCode) VALUES (?, ?, ?, ?)',
            [username, codeLanguage, stdin, sourceCode]);
        connection.release();
        await setexAsync('submissions', 3600, JSON.stringify(req.body));
        console.log('Form data saved to MySQL and cached in Redis');
        flag = 1;
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error saving form data to MySQL:', error);
        res.status(500).json({ error: 'Error saving form data' });
    }
});

app.get('/all-submissions', async (req, res) => {
    // res.json(submissions);
    try {
        if(flag == 0) // no new submissions
        {
            const cachedData = await getAsync('submissions');

            if (cachedData) {
                console.log('Sending data from Redis cache');
                res.json(JSON.parse(cachedData));
            }
            else {
                console.log('No cached data available');
                res.status(404).json({ error: 'No data available' });
            }
        }
        else{
            const connection = await tuf.getConnection();
            console.log("operation on databse");
            const [rows] = await connection.query('SELECT * FROM formdata');
            connection.release();
            await setexAsync('submissions', 3600, JSON.stringify(rows));
            console.log('Fetched all submissions from MySQL');
            res.json(rows);
            console.log("b-flag-",flag);
            flag = 0;
            console.log("a-flag-",flag);
        }
    } catch (error) {
        console.error('Error fetching submissions from MySQL:', error);
        res.status(500).json({ error: 'Error fetching submissions' });
    }
});

app.get('/', (req, res) => {
    res.send({ message: 'Server started' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});