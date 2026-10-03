import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Inbox } from 'lucide-react';
import { api } from '../../services/api';
import './MemberNotifications.css';

const pick = (value, camel, pascal) => value?.[camel] ?? value?.[pascal];

export function MemberNotifications() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const menuRef = useRef(null);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await api.getUnreadNotificationCount();
      setUnreadCount(Number(response?.count ?? response?.Count ?? 0));
    } catch {
      // Keep the header quiet if the notification service is temporarily unavailable.
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getMyNotifications();
      const rows = response?.data ?? response?.Data ?? [];
      setNotifications(Array.isArray(rows) ? rows : []);
      await refreshUnreadCount();
    } catch (loadError) {
      setError(loadError.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [refreshUnreadCount]);

  useEffect(() => {
    refreshUnreadCount();
    const intervalId = window.setInterval(refreshUnreadCount, 60000);
    return () => window.clearInterval(intervalId);
  }, [refreshUnreadCount]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const toggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) loadNotifications();
  };

  const openNotification = async (notification) => {
    const notificationId = pick(notification, 'notificationId', 'NotificationId');
    const referenceId = pick(notification, 'referenceId', 'ReferenceId');
    const type = String(pick(notification, 'notificationType', 'NotificationType') || '').toLowerCase();

    try {
      if (!pick(notification, 'isRead', 'IsRead')) {
        await api.markNotificationRead(notificationId);
        setNotifications((current) => current.map((item) =>
          pick(item, 'notificationId', 'NotificationId') === notificationId
            ? { ...item, isRead: true }
            : item
        ));
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      setOpen(false);
      if (type === 'profilesuggestion' && referenceId) {
        navigate(`/shared-profiles/${referenceId}`);
      } else if (referenceId) {
        navigate('/shared-profiles');
      }
    } catch (markError) {
      setError(markError.message || 'Unable to update notification.');
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
  };

  return (
    <div className="member-notification-menu" ref={menuRef}>
      <button
        type="button"
        className="member-notification-trigger"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggle}
      >
        <Bell size={19} aria-hidden="true" />
        {unreadCount > 0 && <span className="member-notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {open && (
        <section className="member-notification-panel" role="dialog" aria-label="Notifications">
          <header>
            <div><strong>Notifications</strong>{unreadCount > 0 && <span>{unreadCount} unread</span>}</div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close notifications">×</button>
          </header>
          {error && <p className="member-notification-error" role="alert">{error}</p>}
          {loading ? <p className="member-notification-empty">Loading notifications…</p> : notifications.length ? (
            <div className="member-notification-list">
              {notifications.slice(0, 8).map((notification) => {
                const id = pick(notification, 'notificationId', 'NotificationId');
                const isRead = Boolean(pick(notification, 'isRead', 'IsRead'));
                return (
                  <button
                    type="button"
                    key={id}
                    className={`member-notification-item${isRead ? '' : ' unread'}`}
                    onClick={() => openNotification(notification)}
                  >
                    <span className="member-notification-item-icon">{isRead ? <Check size={16} /> : <Bell size={16} />}</span>
                    <span className="member-notification-item-copy">
                      <strong>{pick(notification, 'title', 'Title') || 'Notification'}</strong>
                      <span>{pick(notification, 'message', 'Message') || ''}</span>
                      <small>{formatDate(pick(notification, 'createdAt', 'CreatedAt'))}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : !error ? (
            <div className="member-notification-empty"><Inbox size={20} /><span>No notifications yet.</span></div>
          ) : null}
          <button type="button" className="member-notification-all" onClick={() => { setOpen(false); navigate('/shared-profiles'); }}>
            View shared profiles
          </button>
        </section>
      )}
    </div>
  );
}
