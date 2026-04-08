import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <p className="footer-text">
        © 2001 - {year}. All rights reserved. Built with{' '}
        <span className="highlight">React</span> &{' '}
        <span className="highlight">Node.js</span>
      </p>
    </footer>
  );
};

export default Footer;
