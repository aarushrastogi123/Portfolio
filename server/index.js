const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Profile data
const profile = {
  name: "Aarush Rastogi",
  initials: "AR",
  title: "AI & ML Engineer and UI/UX Designer",
  tagline: "Crafting digital experiences with clean code & creative design",
  bio: "Passionate developer with expertise in building modern, responsive web applications. I specialize in React, Node.js, and creating seamless user experiences that blend form with function.",
  email: "aarushras18@gmail.com",
  phone: "+91 9625726211",
  location: "India",
  social: {
    linkedin: "https://www.linkedin.com/in/aarush-rastogi/",
    github: "https://github.com/aarushrastogi123",
    instagram: "https://www.instagram.com/aarushrastogi_/",
    linktree: "https://linktr.ee/aarushras"
  }
};

// Services data
const services = [
  {
    id: 1,
    title: "Responsive Development",
    description: "Building applications that look stunning on every device — from mobile to widescreen. Pixel-perfect, fluid layouts with modern CSS.",
    image: "/images/responsive-dev.png"
  },
  {
    id: 2,
    title: "Digital Experience",
    description: "Creating engaging digital experiences through strategic UI/UX design, performance optimization, and interactive interfaces.",
    image: "/images/digital-experience.png"
  },
  {
    id: 3,
    title: "People Management",
    description: "Leading cross-functional teams, mentoring developers, and driving projects from ideation to deployment with agile methodologies.",
    image: "/images/people-management.png"
  }
];

// Projects data
const projects = [
  {
    id: 1,
    title: "VisionDX",
    description: "VisionDX is a comprehensive AI-powered diagnostic platform designed to assist healthcare professionals in early disease detection. The system integrates advanced machine learning models to analyze medical images and patient data, providing accurate and rapid diagnostic suggestions. It features a secure, HIPAA-compliant architecture, real-time collaboration tools for multidisciplinary teams, and an intuitive interface that streamlines clinical workflows.",
    tags: ["React", "Node.js"],
    link: "https://vision-dx-seven.vercel.app/"
  },
  {
    id: 2,
    title: "To be Updated",
    description: "To be announced",
    tags: ["React", "Firebase", "Material UI"],
    link: "#"
  },
  {
    id: 3,
    title: "To be Updated",
    description: "To be announced",
    tags: ["Next.js", "OpenAI", "TailwindCSS"],
    link: "#"
  },
  {
    id: 4,
    title: "To be Updated",
    description: "To be announced",
    tags: ["React", "D3.js", "Express"],
    link: "#"
  }
];

// Skills data
const skills = [
  { name: "React", level: 65 },
  { name: "JavaScript", level: 60 },
  { name: "Node.js", level: 60 },
  { name: "HTML / CSS", level: 95 },
  { name: "MongoDB", level: 80 },
  { name: "Machine Learning", level: 75 },
  { name: "Python", level: 70 },
  { name: "UI/UX Design", level: 82 },
  { name: "Artificial Intelligence", level: 75 },
  { name: "Canva", level: 100 },
  { name: "REST APIs", level: 50 },
  { name: "C++", level: 70 }
];

// API Routes
app.get('/api/profile', (req, res) => {
  res.json(profile);
});

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/skills', (req, res) => {
  res.json(skills);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Message received! I will get back to you soon.' });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});
