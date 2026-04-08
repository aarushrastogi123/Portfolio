import './Services.css';

const Services = ({ services }) => {
  return (
    <section className="section" id="services">
      <span className="section-label">What I Do</span>
      <h2 className="section-title">
        <span className="gradient-text">AI & ML Engineer and UI/UX Designer</span>
      </h2>
      <p className="section-subtitle">
        I bring ideas to life through clean code and creativity. Here's what I specialize in.
      </p>

      <div className="services-grid">
        {services.map((service, index) => (
          <div
            className="glass-card service-card"
            key={service.id}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <span className="service-number">0{index + 1}</span>
            <div className="service-image-wrapper">
              <img src={service.image} alt={service.title} loading="lazy" />
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
