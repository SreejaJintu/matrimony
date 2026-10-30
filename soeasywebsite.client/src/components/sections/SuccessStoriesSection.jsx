import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import successImage from '../../assets/succes.png'

const defaultStory = {
  coupleNames: 'Athul & Divya',
  quote: 'We found each other on Viswaas Matrimony and today we are living our happy ever after. Thank you for being a part of our journey.',
  marriedOn: 'Married on 12 Dec 2023',
  imageUrl: successImage,
}

const read = (item, camel, pascal, fallback = '') => item?.[camel] ?? item?.[pascal] ?? fallback

export function SuccessStoriesSection() {
  const [stories, setStories] = useState([defaultStory])

  useEffect(() => {
    let current = true
    api.getTestimonials()
      .then((response) => {
        const rows = Array.isArray(response) ? response : response?.data ?? response?.Data ?? []
        if (current) setStories(rows.map((item) => ({
          coupleNames: read(item, 'coupleNames', 'CoupleNames', 'A Viswaas Couple'),
          quote: read(item, 'quote', 'Quote'),
          marriedOn: read(item, 'marriedOn', 'MarriedOn'),
          imageUrl: read(item, 'imageData', 'ImageData')
            ? `data:${read(item, 'imageContentType', 'ImageContentType', 'image/jpeg')};base64,${read(item, 'imageData', 'ImageData')}`
            : successImage,
        })))
      })
      .catch(() => {})
    return () => { current = false }
  }, [])

  const loopStories = stories.length
    ? Array.from({ length: Math.max(stories.length, 3) }, (_, index) => stories[index % stories.length])
    : []

  return (
    <section id="success-stories" className="success-stories section container">
      {loopStories.length > 0 && <>
        <div className="success-stories-heading">
          <p className="eyebrow">Success Stories</p>
          <h2>We found each other on Viswaas Matrimony</h2>
        </div>
        <div className="success-stories-viewport">
          <div className="success-stories-track">
            {[0, 1].map((copy) => (
              <div className="success-stories-group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
                {loopStories.map((story, index) => (
                  <article className="success-story-card" key={`${copy}-${index}`}>
                    <div className="success-story-image">
                      <img src={story.imageUrl} alt={copy === 0 ? `${story.coupleNames} success story` : ''} loading="lazy" />
                    </div>
                    <div className="success-story-content">
                      <span className="success-story-quote-mark" aria-hidden="true">“</span>
                      <p className="success-quote">{story.quote}</p>
                      <p className="success-author">{story.coupleNames}</p>
                      {story.marriedOn && <p className="success-story-date">{story.marriedOn}</p>}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </>}
      <div className="register-cta-card">
        <div>
          <p className="eyebrow">Register Now</p>
          <h3>It's quick, easy and absolutely free!</h3>
          <ul>
            <li>Create your profile for FREE</li>
            <li>Browse verified profiles</li>
            <li>Express interest and start connecting</li>
            <li>Find your perfect life partner</li>
          </ul>
        </div>
        <Link className="button button-primary" to="/register">Register Free Now</Link>
      </div>
    </section>
  )
}
