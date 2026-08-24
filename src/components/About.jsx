import { TEAM } from '../data/siteData';
import './About.css';

function initials(name) {
  if (!name || name.startsWith('TEAM_')) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function About() {
  return (
    <section id="about" className="section section--alt about" aria-labelledby="about-h">
      <div className="container">
        <div className="about__head reveal">
          <div>
            <span className="section-label">The Team</span>
            <h2 id="about-h" className="about__heading">
              The people behind Genwebzy.
            </h2>
            <p className="about__sub">
              A five-member team that designs, builds and delivers websites.
              No middlemen. You talk to whoever is working on your project.
            </p>
          </div>
        </div>

        <div className="team__grid reveal reveal-d1">
          {TEAM.map((member) => {
            const isPlaceholder = !member.name || member.name.startsWith('TEAM_');
            return (
              <article key={member.id} className="team-card">
                <div className="team-card__photo-wrap">
                  {member.photo
                    ? <img src={member.photo} alt={member.name} className="team-card__photo" loading="lazy" />
                    : (
                      <div className="team-card__avatar">
                        {initials(member.name)}
                      </div>
                    )
                  }
                </div>
                <div className="team-card__info">
                  <h3 className="team-card__name">
                    {isPlaceholder ? <span className="team-card__placeholder">Team Member</span> : member.name}
                  </h3>
                  <span className="team-card__role">{member.role}</span>
                  <p className="team-card__bio">{member.bio}</p>
                  <div className="team-card__skills">
                    {member.skills.map(s => <span key={s} className="team-card__skill">{s}</span>)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
