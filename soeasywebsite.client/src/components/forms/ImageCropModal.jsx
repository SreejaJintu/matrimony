import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import '../../styles/imageCropModal.css'

const OUTPUT_WIDTH = 600
const OUTPUT_HEIGHT = 750
const MIN_ZOOM = 1
const MAX_ZOOM = 3

export function ImageCropModal({ file, onCancel, onSave, saving = false }) {
  const [source, setSource] = useState('')
  const [imageSize, setImageSize] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [error, setError] = useState('')
  const frameRef = useRef(null)
  const dragRef = useRef(null)

  const frameWidth = Math.min(360, Math.max(220, (typeof window === 'undefined' ? 360 : window.innerWidth) - 48))
  const frameHeight = frameWidth * OUTPUT_HEIGHT / OUTPUT_WIDTH
  const baseSize = useMemo(() => {
    if (!imageSize) return null
    const scale = Math.max(frameWidth / imageSize.width, frameHeight / imageSize.height)
    return { width: imageSize.width * scale, height: imageSize.height * scale }
  }, [frameWidth, frameHeight, imageSize])

  useEffect(() => {
    if (!file) return undefined
    const reader = new FileReader()
    reader.onload = () => setSource(String(reader.result || ''))
    reader.onerror = () => setError('Could not read this image. Please choose another file.')
    reader.readAsDataURL(file)
    return () => reader.abort()
  }, [file])

  const handleImageLoad = (event) => {
    setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getClampedPan = (nextPan, nextZoom = zoom) => {
    if (!baseSize) return nextPan
    const maxX = Math.max(0, (baseSize.width * nextZoom - frameWidth) / 2)
    const maxY = Math.max(0, (baseSize.height * nextZoom - frameHeight) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    }
  }

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX - pan.x, y: event.clientY - pan.y }
  }

  const handlePointerMove = (event) => {
    if (!dragRef.current) return
    setPan(getClampedPan({ x: event.clientX - dragRef.current.x, y: event.clientY - dragRef.current.y }))
  }

  const handlePointerUp = () => { dragRef.current = null }

  const handleZoom = (event) => {
    const nextZoom = Number(event.target.value)
    setZoom(nextZoom)
    setPan((current) => getClampedPan(current, nextZoom))
  }

  const handleSave = () => {
    if (!source || !baseSize || saving) return
    setError('')
    const image = new Image()
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = OUTPUT_WIDTH
        canvas.height = OUTPUT_HEIGHT
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Image cropping is not supported in this browser.')

        const clampedPan = getClampedPan(pan)
        const renderedWidth = baseSize.width * zoom
        const renderedHeight = baseSize.height * zoom
        const renderedLeft = (frameWidth - renderedWidth) / 2 + clampedPan.x
        const renderedTop = (frameHeight - renderedHeight) / 2 + clampedPan.y
        const sourceX = Math.max(0, -renderedLeft / renderedWidth * image.naturalWidth)
        const sourceY = Math.max(0, -renderedTop / renderedHeight * image.naturalHeight)
        const sourceWidth = Math.min(image.naturalWidth - sourceX, frameWidth / renderedWidth * image.naturalWidth)
        const sourceHeight = Math.min(image.naturalHeight - sourceY, frameHeight / renderedHeight * image.naturalHeight)
        context.fillStyle = '#fff'
        context.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
        canvas.toBlob((blob) => {
          if (!blob) {
            setError('Could not create the cropped image. Please try again.')
            return
          }
          const name = `${file.name.replace(/\.[^/.]+$/, '') || 'profile-photo'}-cropped.jpg`
          onSave(new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() }))
        }, 'image/jpeg', 0.92)
      } catch (cropError) {
        setError(cropError.message || 'Could not crop this image.')
      }
    }
    image.onerror = () => setError('Could not load this image. Please choose another file.')
    image.src = source
  }

  return (
    <div className="image-crop-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !saving && onCancel()}>
      <section className="image-crop-dialog" role="dialog" aria-modal="true" aria-labelledby="image-crop-title">
        <header className="image-crop-header">
          <div><h2 id="image-crop-title">Crop profile photo</h2><p>Drag to position the photo inside the 4:5 frame.</p></div>
          <button type="button" className="image-crop-close" onClick={onCancel} disabled={saving} aria-label="Close crop dialog"><X size={20} /></button>
        </header>
        <div
          className="image-crop-frame"
          ref={frameRef}
          style={{ width: frameWidth, height: frameHeight }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {source && <img className="image-crop-source" src={source} alt="Photo crop preview" onLoad={handleImageLoad} style={baseSize ? { width: baseSize.width, height: baseSize.height, transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})` } : undefined} />}
          <div className="image-crop-guides" aria-hidden="true" />
        </div>
        <label className="image-crop-zoom">Zoom <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step="0.01" value={zoom} onChange={handleZoom} disabled={!imageSize || saving} /></label>
        {error && <p className="image-crop-error" role="alert">{error}</p>}
        <footer className="image-crop-actions">
          <button type="button" className="image-crop-cancel" onClick={onCancel} disabled={saving}>Cancel</button>
          <button type="button" className="image-crop-save" onClick={handleSave} disabled={!imageSize || saving}>{saving ? 'Processing...' : 'Use This Crop'}</button>
        </footer>
      </section>
    </div>
  )
}
