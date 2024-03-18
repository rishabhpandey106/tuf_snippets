'use client'

import { useState } from 'react';

const FormComponent = () => {
    const [formData, setFormData] = useState({
        username: '',
        codeLanguage: '',
        stdin: '',
        sourceCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://tuf-snippets-backend.onrender.com/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data); // Response from the backend
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
            <select name="codeLanguage" value={formData.codeLanguage} onChange={handleChange} required>
                <option value="">Select Code Language</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
            </select>
            <textarea name="stdin" value={formData.stdin} onChange={handleChange} placeholder="Standard Input" required />
            <textarea name="sourceCode" value={formData.sourceCode} onChange={handleChange} placeholder="Source Code" required />
            <button type="submit">Submit</button>
        </form>
    );
};

export default FormComponent;
