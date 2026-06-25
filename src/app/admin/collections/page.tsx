"use client"

import { useState, useEffect, type ChangeEvent } from 'react'

import { Layers, Trash2, Edit2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { type CollectionConfig, type VariantModel, type Material } from '@/lib/domain/collections'
import { Dialog } from '@/components/ui'
import { ImageDropzone } from '@/components/image-dropzone'
import { setCollections as setCollectionsService, getCollections } from '@/lib/services/collections.service'
import { TextField, Checkbox, Button, IconButton, SelectField } from '@/components/ui'
import { hasProductsInCollection } from '@/lib/services/inventory.service'

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
  displayLimit: undefined,
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
        const list = await getCollections()
        setCollections(list)
      } catch (err) {
        console.error('Failed to load collections', err)
        setCollections([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail === '/admin/collections') {
        setShowAddForm(false)
        setEditingIndex(null)
      }
    }
    window.addEventListener('admin-nav-click', handleNavClick)
    return () => window.removeEventListener('admin-nav-click', handleNavClick)
  }, [])

  const persist = async (updated: CollectionConfig[]) => {
    await setCollectionsService(updated)
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
  const requestDelete = async (slug: string) => {
    setSaving(true)
    try {
      const hasProducts = await hasProductsInCollection(slug)
      if (hasProducts) {
        alert(`Cannot delete "${slug}". It still contains product(s). Reassign or delete them first.`)
        return
      }
      setDeleteSlug(slug)
    } catch (e) {
      console.error(e)
      alert('Failed to check dependencies. Check permissions.')
    } finally {
      setSaving(false)
    }
  }

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
    isNew = false,
  }: {
    form: CollectionConfig | ReturnType<typeof emptyForm>
    onChange: (f: typeof form) => void
    onSave: () => void
    onCancel: () => void
    saveLabel: string
    isNew?: boolean
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-band/40 rounded-xl border border-line">
      <div>
        <TextField 
          label="Slug (URL key)"
          required
          value={form.slug} 
          placeholder="e.g., idols"
          disabled={!isNew}
          className={!isNew ? 'bg-band/50 opacity-70 cursor-not-allowed' : ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })} 
        />
        {!isNew && <p className="text-[11px] text-muted mt-1.5">Slug cannot be changed after creation.</p>}
      </div>
      <div>
        <TextField 
          label="Title"
          required
          value={form.title} 
          placeholder="e.g., Forms of the Divine"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ ...form, title: e.target.value })} 
        />
      </div>
      <div>
        <TextField 
          label="Eyebrow"
          value={form.eyebrow} 
          placeholder="e.g., Divine Idols"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ ...form, eyebrow: e.target.value })} 
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-[0.05em] mb-2 block">Cover image</label>
        <ImageDropzone value={form.image} onChange={url => onChange({ ...form, image: url })} />
      </div>
      <div className="md:col-span-2">
        <TextField 
          label="Standfirst"
          value={form.standfirst} 
          placeholder="One sentence describing this collection…"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ ...form, standfirst: e.target.value })} 
        />
      </div>
      <div>
        <SelectField
          label="Variant model"
          value={form.variantModel}
          onChange={(v) => onChange({ ...form, variantModel: v as VariantModel })}
          options={VARIANT_MODELS}
        />
      </div>
      <div>
        <SelectField
          label="Material"
          value={form.material}
          onChange={(v) => onChange({ ...form, material: v as Material })}
          options={MATERIALS}
        />
      </div>
      <div>
        <SelectField
          label="Grid type"
          value={form.gridType}
          onChange={(v) => onChange({ ...form, gridType: v as 'sparse' | 'utilitarian' })}
          options={GRID_TYPES}
        />
      </div>
      <div>
        <TextField 
          label="Display limit (optional)"
          type="number" 
          placeholder="e.g. 10"
          value={form.displayLimit || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ ...form, displayLimit: e.target.value ? parseInt(e.target.value) : undefined })} 
        />
      </div>
      <div className="pt-2">
        <Checkbox
          label="Dark plate ground (vault)"
          checked={form.darkGround}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ ...form, darkGround: e.target.checked })}
        />
      </div>
      <div className="md:col-span-2 flex justify-end gap-3 mt-12 pt-6 border-t border-line">
        <Button variant="secondary" onClick={onCancel} className="px-6">Cancel</Button>
        <Button onClick={onSave} loading={saving}>{saveLabel}</Button>
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
        <Button
          onClick={() => { setShowAddForm(v => !v); setEditingIndex(null) }}
          className="whitespace-nowrap"
          leftIcon={!showAddForm ? <Plus size={18} /> : undefined}
        >
          {showAddForm ? 'Cancel' : 'Add Collection'}
        </Button>
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
            isNew={true}
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
                        className="p-1 -mx-1 text-muted hover:text-ink disabled:opacity-20 transition-[color,transform] active:scale-[0.97]" title="Move up">
                        <ChevronUp size={16} />
                      </button>
                      <button onClick={() => move(idx, 1)} disabled={idx === collections.length - 1}
                        className="p-1 -mx-1 text-muted hover:text-ink disabled:opacity-20 transition-[color,transform] active:scale-[0.97]" title="Move down">
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Dark ground swatch */}
                    <div
                      className="w-8 h-8 rounded border border-line shrink-0"
                      style={{ backgroundColor: col.darkGround ? 'var(--color-vault)' : 'var(--color-field)' }}
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
                      <IconButton aria-label="Edit" onClick={() => startEdit(idx)} title="Edit">
                        <Edit2 size={18} />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => requestDelete(col.slug)} title="Delete" className="hover:text-danger">
                        <Trash2 size={18} />
                      </IconButton>
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

      <Dialog
        open={!!deleteSlug}
        onClose={() => setDeleteSlug(null)}
        title="Delete Collection"
        description={`Remove "${deleteSlug}" from the storefront? Products assigned to it will remain in Firestore but won't appear in any collection page until reassigned.`}
        footer={
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteSlug(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="danger" loading={saving} onClick={executeDelete} className="w-full sm:w-auto">Delete</Button>
          </div>
        }
      />
    </div>
  )
}
