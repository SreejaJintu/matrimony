import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, MapPin, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Header } from '../components/Layout/Header';
import { AccountSidebar } from '../components/Layout/AccountSidebar';
import './MySharedProfilesPage.css';

const value = (item, camel, pascal, fallback = '') => item?.[camel] ?? item?.[pascal] ?? fallback;

export function MySharedProfilesPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [shares, setShares] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailError, setDetailError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMember = isAuthenticated && user?.isBroker !== true;

  useEffect(() => {
    let active = true;

    async function load() {
      if (!isMember) {
        setShares([]);
        setDetail(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setDetailError('');
      try {
        const listResponse = await api.getMySharedProfiles();
        if (!active) return;

        const list = listResponse?.data ?? listResponse?.Data ?? [];
        setShares(Array.isArray(list) ? list : []);
        if (shareId) {
          try {
            const detailResponse = await api.getSharedProfile(shareId);
            if (!active) return;
            const opened = detailResponse?.data ?? detailResponse?.Data ?? null;
            setDetail(opened);
            if (opened) {
              setShares((current) => current.map((share) =>
                String(value(share, 'shareId', 'ShareId')) === String(shareId)
                  ? { ...share, isViewed: true }
                  : share
              ));
            } else {
              setError('This shared profile could not be found.');
            }
          } catch {
            if (active) setDetailError('This shared profile could not be found or is not available to your account.');
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || 'Unable to load your shared profiles.');
          setShares([]);
          setDetail(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [isMember, shareId]);

  const openShare = (share) => {
    navigate(`/shared-profiles/${value(share, 'shareId', 'ShareId')}`);
  };

  return (
    <div className="shared-profiles-page-shell">
      <Header />
      <div className="shared-profiles-layout">
        {isMember && <AccountSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        <main className="shared-profiles-content">
          <button type="button" className="shared-profiles-mobile-menu" onClick={() => setSidebarOpen(true)}>☰ Menu</button>
          <div className="shared-profiles-heading">
            <div>
              <p className="shared-profiles-eyebrow"><Bell size={14} /> Private recommendations</p>
              <h1>Shared Profiles</h1>
              <p>Profiles selected for you by the Soesy team.</p>
            </div>
            {shareId && <button type="button" className="shared-back-button" onClick={() => navigate('/shared-profiles')}><ArrowLeft size={16} /> All shared profiles</button>}
          </div>

          {!isMember ? (
            <section className="shared-state-card">
              <h2>Please log in as a member</h2>
              <p>Shared profiles are available in the member account that received them.</p>
              <button type="button" onClick={() => navigate('/login')}>Go to login</button>
            </section>
          ) : loading ? (
            <section className="shared-state-card">Loading your shared profiles…</section>
          ) : error ? (
            <section className="shared-state-card shared-state-error" role="alert">{error}</section>
          ) : (
            <div className="shared-profiles-grid-layout">
              <section className="shared-profiles-list" aria-label="Profiles shared with you">
                {shares.length ? shares.map((share) => {
                  const id = value(share, 'shareId', 'ShareId');
                  const viewed = Boolean(value(share, 'isViewed', 'IsViewed', false));
                  return (
                    <button type="button" key={id} className={`shared-profile-list-card${String(id) === String(shareId) ? ' active' : ''}`} onClick={() => openShare(share)}>
                      <img src={value(share, 'photoUrl', 'PhotoUrl') || '/images/default-profile.png'} alt="" />
                      <span className="shared-profile-list-copy">
                        <strong>{value(share, 'fullName', 'FullName', 'Member profile')}</strong>
                        <small>{value(share, 'profileCode', 'ProfileCode', '')}</small>
                        <small>{value(share, 'location', 'Location', 'Location not shared')}</small>
                      </span>
                      {!viewed && <span className="shared-new-badge">New</span>}
                    </button>
                  );
                }) : (
                  <div className="shared-empty"><Sparkles size={22} /><strong>No shared profiles yet</strong><span>New recommendations will appear here.</span></div>
                )}
              </section>

              {shareId && detail ? (
                <article className="shared-profile-detail-card">
                  <img className="shared-profile-detail-photo" src={value(detail, 'photoUrl', 'PhotoUrl') || '/images/default-profile.png'} alt={`${value(detail, 'fullName', 'FullName', 'Member')} profile`} />
                  <div className="shared-profile-detail-info">
                    <span className="shared-profiles-eyebrow">Privately shared with you</span>
                    <h2>{value(detail, 'fullName', 'FullName', 'Member profile')}</h2>
                    <p className="shared-profile-code">{value(detail, 'profileCode', 'ProfileCode', '')}</p>
                    <div className="shared-profile-facts">
                      {value(detail, 'age', 'Age') != null && <span>{value(detail, 'age', 'Age')} years</span>}
                      {value(detail, 'gender', 'Gender') && <span>{value(detail, 'gender', 'Gender')}</span>}
                      <span><MapPin size={15} />{value(detail, 'location', 'Location', 'Location not shared')}</span>
                      {value(detail, 'education', 'Education') && <span><GraduationCap size={15} />{value(detail, 'education', 'Education')}</span>}
                      {value(detail, 'profession', 'Profession') && <span><Briefcase size={15} />{value(detail, 'profession', 'Profession')}</span>}
                    </div>
                    <p className="shared-profile-privacy">Contact details are kept private. Use Soesy to explore more about this profile.</p>
                  </div>
                </article>
              ) : shareId ? (
                <section className="shared-detail-placeholder"><Sparkles size={28} /><h2>Profile unavailable</h2><p>{detailError || 'This shared profile could not be found.'}</p></section>
              ) : (
                <section className="shared-detail-placeholder"><Sparkles size={28} /><h2>Choose a shared profile</h2><p>Select a profile to view its shared details.</p></section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
