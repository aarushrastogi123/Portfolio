import { useState, useEffect, useRef } from 'react';
import './Skills.css';

const techBadges = [
  'React', 'JavaScript', 'HTML','CSS', 'Node.js',
  'MongoDB', 'Python', 'C++', 'Canva',
  'VS Code','Antigravity', 'REST APIs', 'Machine Learning','Artificial Intelligence'
];

const Skills = ({ skills }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="skills" ref={sectionRef}>
      <span className="section-label">Expertise</span>
      <h2 className="section-title">
        Skills & <span className="gradient-text">Technologies</span>
      </h2>
      <p className="section-subtitle">
        Technologies I've been working with and continuously improving in.
      </p>

      <div className="skills-wrapper">
        <div className="skills-list">
          {skills.map((skill, index) => (
            <div className="skill-item" key={skill.name}>
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar-bg">
                {isVisible && (
                  <div
                    className="skill-bar-fill"
                    style={{
                      '--fill-width': `${skill.level}%`,
                      '--delay': `${index * 0.15}s`
                    }}
                  ></div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card skills-info">
          <h3>Tools & Technologies</h3>
          <p>
            I stay up to date with the latest technologies and best practices to deliver modern, performant solutions.
          </p>
          <div className="tech-badges">
            {techBadges.map((badge) => (
              <span className="tech-badge" key={badge}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
