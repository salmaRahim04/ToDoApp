// pages/api/addProject.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { context, color, numberOfTasks } = req.body;

      // Make a POST request to your Flask backend
      const response = await axios.post('http://localhost:5000/add_project', {
        context,
        color,
        number_of_tasks: numberOfTasks // Adjust field name as per your backend
      });

      res.status(201).json({ message: 'Project added successfully', project: response.data.project });
    } catch (error) {
      console.error('Error adding project:', error);
      res.status(500).json({ message: 'Error adding project' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
