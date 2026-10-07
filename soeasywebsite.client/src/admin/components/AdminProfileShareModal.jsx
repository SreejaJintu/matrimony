import { useEffect, useMemo, useState } from "react";
import adminProfileService from "../services/adminProfileService";
import adminProfileShareService from "../services/adminProfileShareService";
import "../styles/adminProfileShare.css";

const PAGE_SIZE = 10;

const getField = (item, camel, pascal) => item?.[camel] ?? item?.[pascal];

const getAge = (dateOfBirth) => {
  if (!dateOfBirth) return "";
  const [year, month, day] = String(dateOfBirth).slice(0, 10).split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) return "";

  const today = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age -= 1;
  return age >= 0 ? `${age} years` : "";
};

const getPaidPlan = (profile) => {
  const planName = getField(profile, "membershipPlanName", "MembershipPlanName");
  const isPremium = getField(profile, "isPremium", "IsPremium") === true;
  return isPremium || (planName && String(planName).trim().toLowerCase() !== "free");
};

const AdminProfileShareModal = ({ onClose }) => {
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientPage, setRecipientPage] = useState(1);
  const [recipients, setRecipients] = useState([]);
  const [recipientTotal, setRecipientTotal] = useState(0);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [recipientLoading, setRecipientLoading] = useState(false);

  const [profileSearch, setProfileSearch] = useState("");
  const [profilePage, setProfilePage] = useState(1);
  const [profiles, setProfiles] = useState([]);
  const [profileTotal, setProfileTotal] = useState(0);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setRecipientLoading(true);
      try {
        const result = await adminProfileService.getProfiles({
          search: recipientSearch.trim(),
          page: recipientPage,
          pageSize: PAGE_SIZE,
        });
        if (!cancelled) {
          setRecipients((result?.data ?? []).filter(getPaidPlan));
          setRecipientTotal(result?.pagination?.totalCount ?? result?.pagination?.TotalCount ?? 0);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.response?.data?.message || "Unable to load paid users.");
      } finally {
        if (!cancelled) setRecipientLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [recipientSearch, recipientPage]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setProfileLoading(true);
      try {
        const result = await adminProfileService.getProfiles({
          search: profileSearch.trim(),
          profileStatusId: 2,
          page: profilePage,
          pageSize: PAGE_SIZE,
        });
        if (!cancelled) {
          const recipientId = Number(getField(selectedRecipient, "userId", "UserId"));
          setProfiles((result?.data ?? []).filter((profile) =>
            Number(getField(profile, "profileStatusId", "ProfileStatusId")) === 2 &&
            Number(getField(profile, "userId", "UserId")) !== recipientId
          ));
          setProfileTotal(result?.pagination?.totalCount ?? result?.pagination?.TotalCount ?? 0);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.response?.data?.message || "Unable to load approved profiles.");
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [profileSearch, profilePage, selectedRecipient]);

  const selectedProfileList = useMemo(() => Object.values(selectedProfiles), [selectedProfiles]);

  const chooseRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setSelectedProfiles({});
    setError("");
    setSuccess("");
  };

  const toggleProfile = (profile) => {
    const userId = Number(getField(profile, "userId", "UserId"));
    setError("");
    setSuccess("");
    if (!selectedProfiles[userId] && selectedProfileList.length >= 2) {
      setError("You can select up to 2 profiles per recipient.");
      return;
    }
    setSelectedProfiles((current) => {
      if (current[userId]) {
        const next = { ...current };
        delete next[userId];
        return next;
      }
      return { ...current, [userId]: profile };
    });
  };

  const sendProfiles = async (event) => {
    event.preventDefault();
    if (!selectedRecipient) {
      setError("Choose an active paid user first.");
      return;
    }
    if (selectedProfileList.length < 1 || selectedProfileList.length > 2) {
      setError("Select 1 or 2 approved profiles to send.");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");
    try {
      const paidUserId = Number(getField(selectedRecipient, "userId", "UserId"));
      await adminProfileShareService.send(paidUserId, selectedProfileList.map((profile) =>
        Number(getField(profile, "userId", "UserId"))
      ));
      setSuccess(`Shared ${selectedProfileList.length} profile${selectedProfileList.length === 1 ? "" : "s"} successfully.`);
      setSelectedProfiles({});
    } catch (sendError) {
      setError(sendError.response?.data?.message || sendError.response?.data?.Message || sendError.message || "Unable to share profiles.");
    } finally {
      setSending(false);
    }
  };

  const downloadSelectedProfiles = async () => {
    if (!selectedProfileList.length) return;

    setDownloadingPdf(true);
    setError("");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const cardWidth = pageWidth - margin * 2;
      let y = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(65, 19, 35);
      doc.text("Matching Profiles", margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(110, 110, 110);
      doc.text(`Prepared ${new Date().toLocaleDateString()}`, margin, y);
      y += 12;

      selectedProfileList.forEach((profile, index) => {
        const location = [
          getField(profile, "city", "City"),
          getField(profile, "districtName", "DistrictName"),
          getField(profile, "stateName", "StateName"),
        ].filter(Boolean).join(", ");
        const rawDetails = [
          ["Profile Code", profileCode(profile)],
          ["Age", getAge(getField(profile, "dateOfBirth", "DateOfBirth"))],
          ["Gender", getField(profile, "genderName", "GenderName")],
          ["Location", location],
          ["Education", getField(profile, "educationName", "EducationName")],
          ["Occupation", getField(profile, "occupationName", "OccupationName")],
        ].filter(([, value]) => value);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const detailLines = rawDetails.map(([label, value]) => ({
          label,
          lines: doc.splitTextToSize(String(value), cardWidth - 44),
        }));
        const contentHeight = 20 + detailLines.reduce((height, detail) => height + detail.lines.length * 5 + 3, 0);

        if (y + contentHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        doc.setDrawColor(225, 225, 225);
        doc.setFillColor(250, 248, 246);
        doc.roundedRect(margin, y, cardWidth, contentHeight, 2, 2, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(doc.splitTextToSize(userName(profile), cardWidth - 12), margin + 6, y + 9);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let detailY = y + 19;
        detailLines.forEach(({ label, lines }) => {
          doc.setTextColor(110, 110, 110);
          doc.text(`${label}:`, margin + 6, detailY);
          doc.setTextColor(50, 50, 50);
          doc.text(lines, margin + 38, detailY, { maxWidth: cardWidth - 44 });
          detailY += lines.length * 5 + 3;
        });
        y += contentHeight + (index < selectedProfileList.length - 1 ? 8 : 0);
      });

      doc.save(`matching-profiles-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (downloadError) {
      console.error("Unable to generate matching profiles PDF:", downloadError);
      setError(downloadError.message || "Unable to generate the PDF. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const totalPages = (count) => Math.max(1, Math.ceil(count / PAGE_SIZE));
  const userName = (profile) => getField(profile, "fullName", "FullName") || "Unnamed profile";
  const profileCode = (profile) => getField(profile, "profileCode", "ProfileCode") || "";
  const userId = (profile) => Number(getField(profile, "userId", "UserId"));
  const recipientPlan = (profile) => getField(profile, "membershipPlanName", "MembershipPlanName") || "Premium";

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !sending && onClose()}>
      <section className="admin-profile-share-modal" role="dialog" aria-modal="true" aria-labelledby="profile-share-title">
        <header className="admin-profile-share-header">
          <div>
            <h2 id="profile-share-title">Send Matching Profiles</h2>
            <p>Share up to two approved profiles privately with a paid member.</p>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose} disabled={sending} aria-label="Close">×</button>
        </header>

        <div className="admin-profile-share-body">
          <section className="share-picker-section">
            <h3>1. Choose paid user</h3>
            {selectedRecipient ? (
              <div className="share-selected-recipient">
                <div><strong>{userName(selectedRecipient)}</strong><span>{profileCode(selectedRecipient)} · {recipientPlan(selectedRecipient)}</span></div>
                <button type="button" onClick={() => chooseRecipient(null)}>Change</button>
              </div>
            ) : (
              <>
                <input
                  className="share-search"
                  type="search"
                  value={recipientSearch}
                  placeholder="Search paid users by name, profile code, or mobile"
                  onChange={(event) => { setRecipientSearch(event.target.value); setRecipientPage(1); setError(""); }}
                />
                {recipientLoading ? <p className="share-loading">Loading paid users…</p> : (
                  <div className="share-picker-results">
                    {recipients.map((recipient) => (
                      <button type="button" className="share-result-row" key={userId(recipient)} onClick={() => chooseRecipient(recipient)}>
                        <span><strong>{userName(recipient)}</strong><small>{profileCode(recipient)}</small></span>
                        <span className="share-plan-badge">{recipientPlan(recipient)}</span>
                      </button>
                    ))}
                    {!recipients.length && <p className="share-empty">No paid users found on this page.</p>}
                  </div>
                )}
                <div className="share-pagination">
                  <span>Page {recipientPage} of {totalPages(recipientTotal)}</span>
                  <div>
                    <button type="button" onClick={() => setRecipientPage((page) => Math.max(1, page - 1))} disabled={recipientPage <= 1 || recipientLoading}>Previous</button>
                    <button type="button" onClick={() => setRecipientPage((page) => Math.min(totalPages(recipientTotal), page + 1))} disabled={recipientPage >= totalPages(recipientTotal) || recipientLoading}>Next</button>
                  </div>
                </div>
              </>
            )}
          </section>

          {selectedRecipient && (
            <section className="share-picker-section">
              <h3>2. Choose approved profiles <span>({selectedProfileList.length}/2)</span></h3>
              <input
                className="share-search"
                type="search"
                value={profileSearch}
                placeholder="Search approved profiles by name, code, or mobile"
                onChange={(event) => { setProfileSearch(event.target.value); setProfilePage(1); setError(""); }}
              />
              {selectedProfileList.length > 0 && (
                <div className="share-selected-list" aria-label="Selected profiles">
                  {selectedProfileList.map((profile) => (
                    <button type="button" key={userId(profile)} onClick={() => toggleProfile(profile)}>
                      {userName(profile)} <span>Remove</span>
                    </button>
                  ))}
                </div>
              )}
              {profileLoading ? <p className="share-loading">Loading approved profiles…</p> : (
                <div className="share-picker-results share-profile-results">
                  {profiles.map((profile) => {
                    const id = userId(profile);
                    const selected = Boolean(selectedProfiles[id]);
                    const image = getField(profile, "profileImageUrl", "ProfileImageUrl") || getField(profile, "imageUrl", "ImageUrl");
                    return (
                      <label className={`share-result-row share-profile-row${selected ? " is-selected" : ""}`} key={id}>
                        <input type="checkbox" checked={selected} onChange={() => toggleProfile(profile)} disabled={!selected && selectedProfileList.length >= 2} />
                        {image && <img src={image} alt="" />}
                        <span><strong>{userName(profile)}</strong><small>{profileCode(profile)} · {getField(profile, "genderName", "GenderName") || ""}</small></span>
                        <span className="share-approved-badge">Approved</span>
                      </label>
                    );
                  })}
                  {!profiles.length && <p className="share-empty">No eligible approved profiles found on this page.</p>}
                </div>
              )}
              <div className="share-pagination">
                <span>Page {profilePage} of {totalPages(profileTotal)}</span>
                <div>
                  <button type="button" onClick={() => setProfilePage((page) => Math.max(1, page - 1))} disabled={profilePage <= 1 || profileLoading}>Previous</button>
                  <button type="button" onClick={() => setProfilePage((page) => Math.min(totalPages(profileTotal), page + 1))} disabled={profilePage >= totalPages(profileTotal) || profileLoading}>Next</button>
                </div>
              </div>
            </section>
          )}

          {error && <div className="admin-form-error" role="alert">{error}</div>}
          {success && <div className="admin-form-success" role="status">{success}</div>}
        </div>

        <footer className="admin-profile-share-footer">
          <button type="button" onClick={onClose} disabled={sending}>Cancel</button>
          <button type="button" onClick={downloadSelectedProfiles} disabled={sending || downloadingPdf || selectedProfileList.length === 0}>
            {downloadingPdf ? "Preparing PDF…" : "Download PDF"}
          </button>
          <button type="button" onClick={sendProfiles} disabled={sending || !selectedRecipient || selectedProfileList.length === 0}>
            {sending ? "Sending…" : "Send Profiles"}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default AdminProfileShareModal;
