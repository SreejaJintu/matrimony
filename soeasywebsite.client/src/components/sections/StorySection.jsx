import successImage from '../../assets/succes.png'
import StoryCTA from './StoryCTA'

export function StorySection() {
  const handleRegisterClick = () => {
    window.location.href = '/registeration.html'
  }

  return (
    <>
      <section className="section container story-grid">
        <div className="story-visual">
          <div className="story-frame">
            <img
              className="story-image"
              src={successImage}
              alt="Happy couple success story"
            />
            <div className="story-overlay" />
            <div className="story-caption">
              <span>Soesy Matrimony</span>
              <p>Honoring tradition through modern presentation.</p>
            </div>
          </div>
        </div>

        <div className="story-copy">
          <p className="eyebrow">Success Stories</p>
          <h2>Honoring tradition, finding love.</h2>
          <blockquote>
            “The process felt thoughtful from the first interaction. We were able
            to focus on compatibility, values, and family expectations without
            noise.”
          </blockquote>
          <p className="quote-author">Aditi & Rohan, Married Oct 2023</p>
          <a className="button button-secondary" href="#profiles">
            Read More Chronicles
          </a>
        </div>
      </section>

      <StoryCTA onRegisterClick={handleRegisterClick} />
    </>
  )
}
