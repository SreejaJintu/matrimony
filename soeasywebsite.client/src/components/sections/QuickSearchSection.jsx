import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'

const lookingForOptions = ['Bride', 'Groom']
const religionOptions = ['Any', 'Hindu', 'Christian', 'Muslim', 'Sikh']
const communityOptions = ['Any', 'Nair', 'Kayastha', 'Khan', 'Brahmin']
const locationOptions = ['Any', 'Kerala', 'Bengaluru', 'Mumbai', 'Delhi']

export function QuickSearchSection() {
  const [activeTab, setActiveTab] = useState('quick')
  const [lookingFor, setLookingFor] = useState('Bride')
  const [ageFrom, setAgeFrom] = useState('22')
  const [ageTo, setAgeTo] = useState('30')
  const [religion, setReligion] = useState('Hindu')
  const [community, setCommunity] = useState('Nair')
  const [location, setLocation] = useState('Kerala')
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (ageFrom) params.set('ageFrom', ageFrom)
    if (ageTo) params.set('ageTo', ageTo)
    if (religion && religion !== 'Any') params.set('religion', religion)
    if (community && community !== 'Any') params.set('community', community)
    if (location && location !== 'Any') params.set('location', location)
    navigate(`/matches?${params.toString()}`)
  }

  return (
    <section id="search" className="quick-search-section">
      <div className="container search-panel-card">
        <div className="search-panel-header">
          <div className="search-tabs" role="tablist" aria-label="Search tabs">
            {['Quick Search', 'Detailed Search', 'ID Search'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`search-tab ${activeTab === tab.toLowerCase().replace(/ /g, '-') ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, '-'))}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="search-submit">
            <button type="submit" className="button button-primary" onClick={handleSearch}>
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        <form className="search-fields" onSubmit={handleSearch}>
          <label className="search-field">
            <span>Looking For</span>
            <div className="select-input">
              <select value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
                {lookingForOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>

          <label className="search-field">
            <span>Age From</span>
            <input type="number" min="18" max="60" value={ageFrom} onChange={(e) => setAgeFrom(e.target.value)} />
          </label>

          <label className="search-field">
            <span>Age To</span>
            <input type="number" min="18" max="60" value={ageTo} onChange={(e) => setAgeTo(e.target.value)} />
          </label>

          <label className="search-field">
            <span>Religion</span>
            <div className="select-input">
              <select value={religion} onChange={(e) => setReligion(e.target.value)}>
                {religionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>

          <label className="search-field">
            <span>Community</span>
            <div className="select-input">
              <select value={community} onChange={(e) => setCommunity(e.target.value)}>
                {communityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>

          <label className="search-field search-field-location">
            <span>Location</span>
            <div className="select-input">
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} />
            </div>
          </label>
        </form>
      </div>
    </section>
  )
}
