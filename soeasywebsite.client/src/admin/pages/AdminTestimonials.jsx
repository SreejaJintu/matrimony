import { useEffect, useState } from "react"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import axios from "axios"
import "../styles/adminTestimonials.css"

const endpoint = "/api/testimonials"
const emptyForm = { coupleNames: "", quote: "", marriedOn: "", imageData: "", imageContentType: "", imagePreview: "", displayOrder: 0, isActive: true }
const tokenConfig = () => {
  const token = localStorage.getItem("soesyAdminToken")
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}
const value = (item, camel, pascal, fallback = "") => item?.[camel] ?? item?.[pascal] ?? fallback

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const loadItems = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${endpoint}/admin`, tokenConfig())
      setItems(Array.isArray(response.data) ? response.data : response.data?.data ?? response.data?.Data ?? [])
      setError("")
    } catch (loadError) {
      setError(loadError.response?.data?.message || loadError.message || "Unable to load testimonials.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadItems() }, [])

  const reset = () => { setForm(emptyForm); setEditingId(null); setError("") }
  const edit = (item) => {
    setEditingId(value(item, "testimonialId", "TestimonialId"))
    setForm({
      coupleNames: value(item, "coupleNames", "CoupleNames"),
      quote: value(item, "quote", "Quote"),
      marriedOn: value(item, "marriedOn", "MarriedOn"),
      imageData: value(item, "imageData", "ImageData"),
      imageContentType: value(item, "imageContentType", "ImageContentType"),
      imagePreview: value(item, "imageData", "ImageData")
        ? `data:${value(item, "imageContentType", "ImageContentType", "image/jpeg")};base64,${value(item, "imageData", "ImageData")}`
        : "",
      displayOrder: value(item, "displayOrder", "DisplayOrder", 0),
      isActive: value(item, "isActive", "IsActive", true),
    })
    setMessage("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")
    const payload = {
      coupleNames: form.coupleNames.trim(),
      quote: form.quote.trim(),
      marriedOn: form.marriedOn.trim(),
      imageData: form.imageData || null,
      imageContentType: form.imageData ? form.imageContentType : null,
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
    }
    try {
      if (editingId) await axios.put(`${endpoint}/${editingId}`, payload, tokenConfig())
      else await axios.post(endpoint, payload, tokenConfig())
      setMessage(editingId ? "Testimonial updated." : "Testimonial created.")
      reset()
      await loadItems()
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message || "Unable to save testimonial.")
    } finally {
      setSaving(false)
    }
  }

  const selectImage = (file) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || "")
      setForm((current) => ({
        ...current,
        imageData: dataUrl.split(",")[1] || "",
        imageContentType: file.type,
        imagePreview: dataUrl,
      }))
      setError("")
    }
    reader.onerror = () => setError("Unable to read the selected image.")
    reader.readAsDataURL(file)
  }

  const remove = async (item) => {
    const id = value(item, "testimonialId", "TestimonialId")
    const name = value(item, "coupleNames", "CoupleNames", "this testimonial")
    if (!window.confirm(`Delete the testimonial for ${name}?`)) return
    try {
      await axios.delete(`${endpoint}/${id}`, tokenConfig())
      setItems((current) => current.filter((row) => value(row, "testimonialId", "TestimonialId") !== id))
      setMessage("Testimonial deleted.")
      if (editingId === id) reset()
    } catch (removeError) {
      setError(removeError.response?.data?.message || removeError.message || "Unable to delete testimonial.")
    }
  }

  return (
    <div className="admin-testimonials-page">
      <header className="admin-testimonials-heading">
        <div><h1>Testimonials</h1><p>Manage the success stories shown on the public home page.</p></div>
      </header>

      <section className="admin-testimonials-form-card">
        <div className="admin-testimonials-card-heading">
          <h2>{editingId ? "Edit testimonial" : "Add testimonial"}</h2>
          {editingId && <button type="button" className="admin-testimonials-cancel" onClick={reset}><X size={16} /> Cancel edit</button>}
        </div>
        <form onSubmit={submit} className="admin-testimonials-form">
          <label>Couple names *<input required maxLength={160} value={form.coupleNames} onChange={(e) => setForm({ ...form, coupleNames: e.target.value })} placeholder="Athul & Divya" /></label>
          <label>Married on<input maxLength={100} value={form.marriedOn} onChange={(e) => setForm({ ...form, marriedOn: e.target.value })} placeholder="12 Dec 2023" /></label>
          <label className="wide">Story quote *<textarea required maxLength={1200} rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="Share their story..." /></label>
          <label className="wide">Couple photo (JPEG, PNG, WebP, or GIF; up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => selectImage(e.target.files?.[0])} /></label>
          {form.imagePreview && <div className="admin-testimonial-image-preview wide"><img src={form.imagePreview} alt="Selected couple" /><button type="button" onClick={() => setForm({ ...form, imageData: "", imageContentType: "", imagePreview: "" })}>Remove photo</button></div>}
          <label>Display order<input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} /></label>
          <label className="admin-testimonials-active"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Show on home page</label>
          {error && <p className="admin-testimonials-error wide" role="alert">{error}</p>}
          {message && <p className="admin-testimonials-success wide" role="status">{message}</p>}
          <div className="admin-testimonials-form-actions wide"><button type="submit" disabled={saving}><Plus size={16} />{saving ? "Saving..." : editingId ? "Save changes" : "Add testimonial"}</button></div>
        </form>
      </section>

      <section className="admin-testimonials-list-card">
        <div className="admin-testimonials-card-heading"><h2>Existing testimonials</h2><span>{items.length} total</span></div>
        {loading ? <p className="admin-testimonials-state">Loading testimonials...</p> : items.length === 0 ? <p className="admin-testimonials-state">No testimonials yet. Add one above.</p> : (
          <div className="admin-testimonials-table-wrap"><table className="admin-testimonials-table"><thead><tr><th>Story</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {items.map((item) => {
              const id = value(item, "testimonialId", "TestimonialId")
              const active = value(item, "isActive", "IsActive", false)
              const imageData = value(item, "imageData", "ImageData")
              const imageType = value(item, "imageContentType", "ImageContentType", "image/jpeg")
              return <tr key={id}><td>{imageData && <img className="admin-testimonials-thumb" src={`data:${imageType};base64,${imageData}`} alt="" />}<strong>{value(item, "coupleNames", "CoupleNames")}</strong><p>{value(item, "quote", "Quote")}</p><small>{value(item, "marriedOn", "MarriedOn")}</small></td><td>{value(item, "displayOrder", "DisplayOrder", 0)}</td><td><span className={`admin-testimonials-status ${active ? "active" : "inactive"}`}>{active ? "Active" : "Hidden"}</span></td><td><div className="admin-testimonials-row-actions"><button type="button" onClick={() => edit(item)} aria-label="Edit testimonial"><Pencil size={16} /></button><button type="button" onClick={() => remove(item)} aria-label="Delete testimonial"><Trash2 size={16} /></button></div></td></tr>
            })}
          </tbody></table></div>
        )}
      </section>
    </div>
  )
}
