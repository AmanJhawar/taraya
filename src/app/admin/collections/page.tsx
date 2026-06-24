"use client"

import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore/lite'
import { app } from '@/lib/firebase/config'
import { Layers, Trash2, Edit2, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { type CollectionConfig, type VariantModel, type Material } from '@/lib/collections'
import { ConfirmModal } from '@/components/confirm-modal'
import CustomSelect from '@/components/custom-select'
import { ImageDropzone } from '@/components/image-dropzone'

const db = getFirestore(app)
const FIRESTORE_KEY = doc(db, 'settings', 'collections')

const VARIANT_MODELS: { value: VariantModel; label: string }[] = [
  { value: 'sizes-purity', label: 'Sizes + Purity' },
  { value: 'stones', label: 'Stones' },
  { value: 'weights', label: 'Weights' },
]

const MATERIALS: { value: Material; label: string }[] = [
  { value: 'silver', label: 'Silver' },
  { value: 'stone-set', label: 'Stone-Set' },
  { value: 'bullion', label: 'Bullion' },
]

const GRID_TYPES: { value: 'sparse' | 'utilitarian'; label: string }[] = [
  { value: 'sparse', label: 'Sparse (2-col, generous)' },
  { value: 'utilitarian', label: 'Utilitarian (3-col, tight)' },
]

const emptyForm = (): Omit<CollectionConfig, 'slug'> & { slug: string } => ({
  slug: '',
  eyebrow: '',
  title: '',
  standfirst: '',
  image: '',
  gridType: 'sparse',
  variantModel: 'sizes-purity',
  darkGround: false,
  material: 'silver',
})

export default function AdminCollections() {
  const [collections, setCollections] = useState<CollectionConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<CollectionConfig | null>(null)
  const [addForm, setAddForm] = useState(emptyForm())
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(FIRESTORE_KEY)
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setCollections(snap.data().list as CollectionConfig[])
        } else {
          setCollections([])
          await setDoc(FIRESTORE_KEY, { list: [] })
        }
      } catch (err) {
        console.error('Failed to load collections', err)
        setCollections([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const persist = async (updated: CollectionConfig[]) => {
    await setDoc(FIRESTORE_KEY, { list: updated })
    setCollections(updated)
  }

  // ── Add ──
  const handleAdd = async () => {
    const slug = addForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    if (!slug || !addForm.title.trim()) { alert('Slug and title are required.'); return }
    if (collections.some(c => c.slug === slug)) { alert(`A collection with slug "${slug}" already exists.`); return }
    setSaving(true)
    try {
      await persist([...collections, { ...addForm, slug: slug }])
      setAddForm(emptyForm())
      setShowAddForm(false)
    } catch { alert('Failed to save. Check permissions.') }
    finally { setSaving(false) }
  }

  // ── Edit ──
  const startEdit = (idx: number) => {
    setEditingIndex(idx)
    setEditForm({ ...collections[idx] })
  }
  const cancelEdit = () => { setEditingIndex(null); setEditForm(null) }
  const saveEdit = async (idx: number) => {
    if (!editForm) return
    const slug = editForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    if (!slug || !editForm.title.trim()) { alert('Slug and title are required.'); return }
    if (collections.some((c, i) => i !== idx && c.slug === slug)) { alert(`Another collection with slug "${slug}" already exists.`); return }
    setSaving(true)
    try {
      const updated = [...collections]
      updated[idx] = { ...editForm, slug }
      await persist(updated)
      setEditingIndex(null)
      setEditForm(null)
    } catch { alert('Failed to save. Check permissions.') }
    finally { setSaving(false) }
  }

  // ── Delete ──
  const executeDelete = async () => {
    if (!deleteSlug) return
    setSaving(true)
    try {
      await persist(collections.filter(c => c.slug !== deleteSlug))
    } catch { alert('Failed to delete. Check permissions.') }
    finally { setSaving(false); setDeleteSlug(null) }
  }

  // ── Reorder ──
  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= collections.length) return
    const updated = [...collections]
    ;[updated[idx], updated[target]] = [updated[target], updated[idx]]
    await persist(updated)
  }

  const CollectionForm = ({
    form,
    onChange,
    onSave,
    onCancel,
    saveLabel,
  }: {
    form: CollectionConfig | ReturnType<typeof emptyForm>
    onChange: (f: typeof form) => void
    onSave: () => void
    onCancel: () => void
    saveLabel: string
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-band/40 rounded-xl border border-line">
      <div>
        <label className="admin-label required">Slug (URL key)</label>
        <input className="admin-input" value={form.slug} placeholder="e.g., idols"
          onChange={e => onChange({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })} />
      </div>
      <div>
        <label className="admin-label required">Title</label>
        <input className="admin-input" value={form.title} placeholder="e.g., Forms of the Divine"
          onChange={e => onChange({ ...form, title: e.target.value })} />
      </div>
      <div>
        <label className="admin-label">Eyebrow</label>
        <input className="admin-input" value={form.eyebrow} placeholder="e.g., Divine Idols"
          onChange={e => onChange({ ...form, eyebrow: e.target.value })} />
      </div>
      <div>
        <label className="admin-label">Cover image</label>
        <ImageDropzone value={form.image} onChange={url => onChange({ ...form, image: url })} />
      </div>
      <div className="md:col-span-2">
        <label className="admin-label">Standfirst</label>
        <input className="admin-input" value={form.standfirst} placeholder="One sentence describing this collection…"
          onChange={e => onChange({ ...form, standfirst: e.target.value })} />
      </div>
      <div className="flex flex-col">
        <label className="admin-label mb-2">Variant model</label>
        <CustomSelect
          value={form.variantModel}
          onChange={v => onChange({ ...form, variantModel: v as VariantModel })}
          options={VARIANT_MODELS}
          className="py-2.5 px-4 text-[15px] font-medium"
        />
      </div>
      <div className="flex flex-col">
        <label className="admin-label mb-2">Material</label>
        <CustomSelect
          value={form.material}
          onChange={v => onChange({ ...form, material: v as Material })}
          options={MATERIALS}
          className="py-2.5 px-4 text-[15px] font-medium"
        />
      </div>
      <div className="flex flex-col">
        <label className="admin-label mb-2">Grid type</label>
        <CustomSelect
          value={form.gridType}
          onChange={v => onChange({ ...form, gridType: v as 'sparse' | 'utilitarian' })}
          options={GRID_TYPES}
          className="py-2.5 px-4 text-[15px] font-medium"
        />
      </div>
      <div className="flex items-center gap-3 pt-5">
        <label className="admin-checkbox cursor-pointer select-none">
          <input type="checkbox" className="sr-only" checked={form.darkGround}
            onChange={e => onChange({ ...form, darkGround: e.target.checked })} />
          <span className={`inline-flex h-5 w-5 items-center justify-center border-2 transition-colors ${form.darkGround ? 'border-ink bg-ink' : 'border-muted bg-transparent'}`}>
            {form.darkGround && <Check size={12} className="text-white" strokeWidth={3} />}
          </span>
          <span className="text-sm text-ink">Dark plate ground (#2B2723)</span>
        </label>
      </div>
      <div className="md:col-span-2 flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="admin-btn-outline">Cancel</button>
        <button type="button" onClick={onSave} disabled={saving} className="admin-btn-primary disabled:opacity-50">{saveLabel}</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight flex items-center gap-3 font-serif">
            <Layers size={28} />
            Collections
          </h1>
          <p className="text-muted">Manage the collections displayed on the storefront. Order controls display sequence.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(v => !v); setEditingIndex(null) }}
          className="admin-btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          {showAddForm ? 'Cancel' : 'Add Collection'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-4">New Collection</h2>
          <CollectionForm
            form={addForm}
            onChange={setAddForm}
            onSave={handleAdd}
            onCancel={() => { setShowAddForm(false); setAddForm(emptyForm()) }}
            saveLabel="Add Collection"
          />
        </div>
      )}

      {/* List */}
      <div className="bg-field rounded-xl border border-line shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink" />
          </div>
        ) : (
          <div className="divide-y divide-line">
            {collections.map((col, idx) => (
              <div key={col.slug}>
                {editingIndex === idx && editForm ? (
                  <div className="p-5">
                    <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Editing — {col.title}</p>
                    <CollectionForm
                      form={editForm}
                      onChange={f => setEditForm(f as CollectionConfig)}
                      onSave={() => saveEdit(idx)}
                      onCancel={cancelEdit}
                      saveLabel="Save Changes"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-band/40 transition-colors">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button onClick={() => move(idx, -1)} disabled={idx === 0}
                        className="text-muted hover:text-ink disabled:opacity-20 transition-[color,transform] active:scale-[0.97]" title="Move up">
                        <ChevronUp size={16} />
                      </button>
                      <button onClick={() => move(idx, 1)} disabled={idx === collections.length - 1}
                        className="text-muted hover:text-ink disabled:opacity-20 transition-[color,transform] active:scale-[0.97]" title="Move down">
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Dark ground swatch */}
                    <div
                      className="w-8 h-8 rounded border border-line shrink-0"
                      style={{ backgroundColor: col.darkGround ? '#2B2723' : '#ECE6DC' }}
                      title={col.darkGround ? 'Dark ground' : 'Light ground'}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ink truncate">{col.title}</div>
                      <div className="text-xs text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                        <code className="bg-band px-1.5 py-0.5 rounded text-[11px]">/{col.slug}</code>
                        <span>{col.variantModel}</span>
                        <span>·</span>
                        <span>{col.material}</span>
                        <span>·</span>
                        <span>{col.gridType}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit(idx)}
                        className="text-muted hover:text-ink transition-[color,transform] active:scale-[0.97] p-2" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeleteSlug(col.slug)}
                        className="text-muted hover:text-ink transition-[color,transform] active:scale-[0.97] p-2" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {collections.length === 0 && (
              <p className="text-muted text-center py-12">No collections. Add one above.</p>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteSlug}
        title="Delete Collection"
        description={`Remove "${deleteSlug}" from the storefront? Products assigned to it will remain in Firestore but won't appear in any collection page until reassigned.`}
        confirmText="Delete"
        onClose={() => setDeleteSlug(null)}
        onConfirm={executeDelete}
      />
    </div>
  )
}
