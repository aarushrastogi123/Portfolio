import { useState, useEffect } from 'react';
import './Hero.css';

const titles = ['AI & ML Engineer','UI/UX Designer', 'Critical Thinker','Problem Solver', 'Full Stack Developer'];

const Hero = ({ profile }) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    let timeout;

    if (!isDeleting && displayText === currentTitle) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentTitle.substring(0, displayText.length - 1)
            : currentTitle.substring(0, displayText.length + 1)
        );
      }, isDeleting ? 50 : 100);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section hero" id="hero">
      <div className="hero-content">
        <p className="hero-greeting">
          Hello <span className="wave">👋</span>, I'm <strong>{profile.name || 'Aarush Rastogi'}</strong>
        </p>
        <div className="hero-title-line">
          <span className="typing-text">{displayText}</span>
        </div>
        <p className="hero-description">
          {profile.bio || "Passionate developer with expertise in building modern, responsive web applications. I specialize in React, Node.js, and creating seamless user experiences that blend form with function."}
        </p>
        <div className="hero-actions">
          <button className="btn-gradient" onClick={() => scrollToSection('projects')}>
            <span>View My Work</span>
          </button>
          <button className="btn-outline" onClick={() => scrollToSection('contact')}>
            Let's Talk →
          </button>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="hero-float-element hero-float-1"></div>
      <div className="hero-float-element hero-float-2"></div>
      <div className="hero-float-element hero-float-3"></div>

      <div className="hero-scroll-indicator">
        <span>Scroll Down</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;
