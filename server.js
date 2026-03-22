const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Supabase setup
const SUPABASE_URL = 'https://lqeduopeqvpatbxrsczx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZWR1b3BlcXZwYXRieHJzY3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjAyMzQsImV4cCI6MjA4OTczNjIzNH0.4wIUI7CoKMnfJLWHR9BGROEyg5gVUpu0vpCHHpvvMoI';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST /contact — save a message
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const { error } = await supabase
    .from('message')
    .insert([{ name, email, message }]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save message.' });
  }

  res.json({ success: true, message: 'Message saved successfully!' });
});

// GET /messages — view all saved messages
app.get('/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch messages.' });
  }

  res.json(data);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
