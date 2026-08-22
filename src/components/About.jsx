import { TEAM } from '../data/siteData';
import './About.css';

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-heading">
      <div className="container">
        {/* About text */}
        <div className="about__intro reveal">
          <div className="about__intro-left">
            <span className="label">About Us</span>
            <h2 id="about-heading" className="section-heading" style={{ marginTop: '1rem' }}>
              A small team.<br />One goal.
            </h2>
          </div>
          <div className="about__intro-right">
            <p className="about__body">
              GenWebZy is a 5-member web development team focused on creating modern and
              practical digital experiences. We combine design, development and deployment
              to help businesses and individuals establish a stronger presence online.
            </p>
            <p className="about__body" style={{ marginTop: '1.25rem' }}>
              We started GenWebZy because we wanted to build websites that are not only
              visually appealing, but also useful, responsive and easy for businesses to manage.
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="about__team-header reveal">
          <h3 className="about__team-heading">Meet the Team</h3>
          <p className="about__team-sub">Five people working together to turn ideas into websites.</p>
        </div>

        <div className="team__grid">
          {TEAM.map((member, i) => (
            <div key={member.id} className="team-card reveal" style={{ '--delay': i * 0.08 + 's' }}>
              <div className="team-card__photo-wrap">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="team-card__photo" />
                ) : (
                  <div className="team-card__photo-placeholder" aria-hidden="true">
                    <span>{member.name.startsWith('TEAM') ? '?' : member.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="team-card__info">
                <div className="team-card__header">
                  <div>
                    <h4 className="team-card__name">
                      {member.name.startsWith('TEAM_MEMBER') ? (
                        <span className="team-card__placeholder-name">{member.id}</span>
                      ) : member.name}
                    </h4>
                    <p className="team-card__role">{member.role}</p>
                  </div>
                  <div className="team-card__links">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="team-card__social" aria-label={`${member.name} LinkedIn`}>
                        <LinkedInIcon />
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="team-card__social" aria-label={`${member.name} GitHub`}>
                        <GitHubIcon />
                      </a>
                    )}
                  </div>
                </div>
                <p className="team-card__bio">{member.bio}</p>
                <div className="team-card__skills">
                  {member.skills.map(skill => (
                    <span key={skill} className="team-card__skill">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
