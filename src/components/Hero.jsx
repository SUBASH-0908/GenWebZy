import './Hero.css';

export default function Hero() {
  return (
    <section id="home" className="hero" aria-label="Hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="label hero__label hero__anim hero__anim--1">Web Development Solutions</span>

          <h1 className="hero__heading hero__anim hero__anim--2">
            We build websites that help businesses&nbsp;
            <span className="hero__heading-accent">move forward.</span>
          </h1>

          <p className="hero__body hero__anim hero__anim--3">
            GenWebZy is a 5-member web development team creating modern, responsive and
            practical websites for businesses, professionals and individuals.
          </p>

          <div className="hero__tagline hero__anim hero__anim--3">
            DESIGN&ensp;•&ensp;DEVELOP&ensp;•&ensp;DEPLOY
          </div>

          <div className="hero__actions hero__anim hero__anim--4">
            <a href="#contact" className="btn btn--primary btn--lg">
              Start a Project
            </a>
            <a href="#work" className="btn btn--outline btn--lg">
              View Our Work
            </a>
          </div>
        </div>

        <div className="hero__visual hero__anim hero__anim--4" aria-hidden="true">
          <div className="hero__logo-wrap">
            <img src="/logo.png" alt="" className="hero__logo-img" />
          </div>
          <div className="hero__dots" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
