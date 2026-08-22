import './Introduction.css';

export default function Introduction() {
  return (
    <section className="intro section--alt" aria-label="Introduction">
      <div className="container">
        <div className="intro__inner">
          <div className="intro__text reveal">
            <h2 className="intro__heading">
              Built for businesses that want a better presence online.
            </h2>
            <p className="intro__body">
              We work with businesses, professionals and individuals to design and develop
              websites that are clear, responsive and easy to use. From simple business
              websites to custom web solutions, we focus on understanding the requirement
              first and building around it.
            </p>
          </div>
          <div className="intro__pillars reveal reveal-delay-2">
            {[
              { label: 'Design', desc: 'Thoughtful, clean visual direction tailored to your brand.' },
              { label: 'Develop', desc: 'Responsive, well-structured code built to last.' },
              { label: 'Deploy', desc: 'Launch-ready with domain, hosting and everything in place.' },
            ].map(p => (
              <div key={p.label} className="intro__pillar">
                <span className="intro__pillar-label">{p.label}</span>
                <p className="intro__pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
