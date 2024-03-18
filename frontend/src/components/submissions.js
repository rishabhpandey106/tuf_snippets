'use client'

import { useState, useEffect } from 'react';
import styles from './submissions.css';

const AllSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        fetch('https://tuf-snippets-backend.vercel.app/all-submissions')
            .then((response) => response.json())
            .then((data) => setSubmissions(data))
            .catch((error) => console.error('Error fetching submissions:', error));
    }, []);

    return (
        <div className={styles.container}>
            <h1>All Submissions</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Code Language</th>
                        <th>Standard Input</th>
                        <th>Timestamp</th>
                        <th>Source Code</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission, index) => (
                        <tr key={index}>
                            <td>{submission.username}</td>
                            <td>{submission.codeLanguage}</td>
                            <td style={{ whiteSpace: 'pre-line' }}>{submission.stdin}</td>
                            <td>{submission.timestamp}</td>
                            <td style={{ whiteSpace: 'pre-line' }}>{submission.sourceCode ? submission.sourceCode.slice(0, 100) : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllSubmissions;
