const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

let submissions = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

fs.readFile('submissions.json', 'utf8', (err, data) => {
    if (!err) {
        submissions = JSON.parse(data);
    }
});

app.post('/submit-form', (req, res) => {
    const { username, codeLanguage, stdin, sourceCode } = req.body;
    console.log(req.body)
    const timestamp = new Date().toISOString();

    const newSubmission = { username, codeLanguage, stdin, sourceCode, timestamp };
    submissions.push(newSubmission);

    // Save submissions to JSON file
    fs.writeFile('submissions.json', JSON.stringify(submissions, null, 2), (err) => {
        if (err) {
            console.error('Error saving submissions:', err);
            res.status(500).json({ error: 'Error saving submissions' });
        } else {
            console.log('Submission saved successfully');
            res.status(200).json({ message: 'Form submitted successfully' });
        }
    });
});

app.get('/all-submissions', (req, res) => {
    res.json(submissions);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
