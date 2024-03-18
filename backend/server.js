const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fs = require('fs');
const tuf = require("./models/database");

const app = express();
const port = 3001;

let submissions = [];

app.use(cors({
    allowedHeaders: ['*'],
    origin: '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Retrieval
// fs.readFile('submissions.json', 'utf8', (err, data) => {
//     if (!err) {
//         submissions = JSON.parse(data);
//     }
// });

app.post('/submit-form', async (req, res) => {
    const { username, codeLanguage, stdin, sourceCode } = req.body;
    console.log(req.body)
    // const timestamp = new Date().toISOString();

    try {
        const connection = await tuf.getConnection();
        await connection.query('INSERT INTO formdata (username, codeLanguage, stdin, sourceCode) VALUES (?, ?, ?, ?)',
            [username, codeLanguage, stdin, sourceCode]);
        connection.release();
        console.log('Form data saved to MySQL');
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error saving form data to MySQL:', error);
        res.status(500).json({ error: 'Error saving form data' });
    }

    // const newSubmission = { username, codeLanguage, stdin, sourceCode, timestamp };
    // submissions.push(newSubmission);

    // // Saving
    // fs.writeFile('submissions.json', JSON.stringify(submissions, null, 2), (err) => {
    //     if (err) {
    //         console.error('Error saving submissions:', err);
    //         res.status(500).json({ error: 'Error saving submissions' });
    //     } else {
    //         console.log('Submission saved successfully');
    //         res.status(200).json({ message: 'Form submitted successfully' });
    //     }
    // });
});

app.get('/all-submissions', async (req, res) => {
    // res.json(submissions);
    try {
        const connection = await tuf.getConnection();
        const [rows] = await connection.query('SELECT * FROM formdata');
        connection.release();
        console.log('Fetched all submissions from MySQL');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching submissions from MySQL:', error);
        res.status(500).json({ error: 'Error fetching submissions' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});