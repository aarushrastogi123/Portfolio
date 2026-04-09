import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import NavDots from './components/NavDots';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

const API_URL = '';

function App() {
  const [profile, setProfile] = useState({
    name: 'Aarush Rastogi',
    initials: 'AR',
    title: 'Catch me On',
    bio: '',
    email: 'aarushras18@gmail.com',
    phone: '+91 9625726211',
    location: 'India',
    social: {}
  });
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallbackServices = [
      { id: 1, title: 'Responsive Development', description: 'Building applications that look stunning on every device — from mobile to widescreen. Pixel-perfect, fluid layouts with modern CSS.', image: '/images/responsive-dev.png' },
      { id: 2, title: 'Digital Experience', description: 'Creating engaging digital experiences through strategic UI/UX design, performance optimization, and interactive interfaces.', image: '/images/digital-experience.png' },
      { id: 3, title: 'People Management', description: 'Leading cross-functional teams, mentoring developers, and driving projects from ideation to deployment with agile methodologies.', image: '/images/people-management.png' }
    ];
    const fallbackProjects = [
      { id: 1, title: 'VisionDX', description: 'VisionDX is a comprehensive AI-powered diagnostic platform designed to assist healthcare professionals in early disease detection. The system integrates advanced machine learning models to analyze medical images and patient data, providing accurate and rapid diagnostic suggestions. It features a secure, HIPAA-compliant architecture, real-time collaboration tools for multidisciplinary teams, and an intuitive interface that streamlines clinical workflows.', tags: ['React', 'Node.js'], link: 'https://vision-dx-seven.vercel.app/' },
      { id: 2, title: 'To be Updated', description: 'To be announced', tags: ['React', 'Firebase', 'Material UI'], link: '#' },
      { id: 3, title: 'To be Updated', description: 'To be announced', tags: ['Next.js', 'OpenAI', 'TailwindCSS'], link: '#' },
      { id: 4, title: 'To be Updated', description: 'To be announced', tags: ['React', 'D3.js', 'Express'], link: '#' }
    ];
    const fallbackSkills = [
      { name: 'React', level: 65 },
      { name: 'JavaScript', level: 60 },
      { name: 'Node.js', level: 60 },
      { name: 'HTML / CSS', level: 100 },
      { name: 'Machine Learning', level: 75 },
      { name: 'Python', level: 80 },
      { name: 'UI/UX Design', level: 82 },
      { name: 'Canva', level: 100 },
      { name: 'C++', level: 70 }
    ];

    // Set fallback data immediately
    setServices(fallbackServices);
    setProjects(fallbackProjects);
    setSkills(fallbackSkills);

    const fetchData = async () => {
      try {
        const [profileRes, servicesRes, projectsRes, skillsRes] = await Promise.all([
          fetch(`${API_URL}/api/profile`),
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/projects`),
          fetch(`${API_URL}/api/skills`)
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (servicesRes.ok) setServices(await servicesRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (skillsRes.ok) setSkills(await skillsRes.json());
      } catch (err) {
        console.log('API not available, using fallback data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Background glows */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      <Sidebar profile={profile} />

      <main className="main-content">
        <Hero profile={profile} />
        <Services services={services} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Contact profile={profile} />
        <Footer />
      </main>

      <NavDots />
    </div>
  );
}

export default App;
