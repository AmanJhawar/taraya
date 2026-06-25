"use client"

import { useState, useEffect } from 'react'
import { getMakingStages, setMakingStages } from '@/lib/services/the-making.service'
import { type MakingStage } from '@/lib/domain/the-making'
import { BookOpen, Trash2, Edit2, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { ImageDropzone } from '@/components/image-dropzone'
import Image from 'next/image'
import { TextField, TextareaField, Checkbox, Button, IconButton, Dialog } from '@/components/ui'

function emptyForm(): MakingStage {
  return {
    id: crypto.randomUUID(),
    numberLabel: '',
    title: '',
    description: '',
    imagePath: '',
    isDarkPlate: false,
  }
}

export default function AdminTheMaking() {
  const [stages, setStages] = useState<MakingStage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  
  const [addForm, setAddForm] = useState<MakingStage>(emptyForm())
  const [editForm, setEditForm] = useState<MakingStage | null>(null)
  
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    getMakingStages().then(data => setStages(data)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail === '/admin/the-making') {
        setShowAddForm(false)
        setEditingIndex(null)
      }
    }
    window.addEventListener('admin-nav-click', handleNavClick)
    return () => window.removeEventListener('admin-nav-click', handleNavClick)
  }, [])

  const persist = async (list: MakingStage[]) => {
    await setMakingStages(list)
    setStages(list)
  }

  // ── Handlers ──
  const handleAdd = async () => {
    if (!addForm.title.trim() || !addForm.imagePath) { alert('Title and Image are required.'); return }
    setSaving(true)
    try {
      const updated = [...stages, { ...addForm, id: crypto.randomUUID() }]
      await persist(updated)
      setAddForm(emptyForm())
      setShowAddForm(false)
    } catch { alert('Failed to save. Check permissions.') }
    finally { setSaving(false) }
  }

  const startEdit = (idx: number) => {
    setShowAddForm(false)
    setEditingIndex(idx)
    setEditForm({ ...stages[idx] })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditForm(null)
  }

  const saveEdit = async (idx: number) => {
    if (!editForm) return
    if (!editForm.title.trim() || !editForm.imagePath) { alert('Title and Image are required.'); return }
    setSaving(true)
    try {
      const updated = [...stages]
      updated[idx] = { ...editForm }
      await persist(updated)
      setEditingIndex(null)
      setEditForm(null)
    } catch { alert('Failed to save. Check permissions.') }
    finally { setSaving(false) }
  }

  const executeDelete = async () => {
    if (!deleteId) return
    setSaving(true)
    try {
      await persist(stages.filter(s => s.id !== deleteId))
    } catch { alert('Failed to delete. Check permissions.') }
    finally { setSaving(false); setDeleteId(null) }
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= stages.length) return
    const updated = [...stages]
    ;[updated[idx], updated[target]] = [updated[target], updated[idx]]
    await persist(updated)
  }

  // ── Components ──
  const StageForm = ({
    form,
    onChange,
    onSave,
    onCancel,
    saveLabel,
  }: {
    form: MakingStage
    onChange: (f: MakingStage) => void
    onSave: () => void
    onCancel: () => void
    saveLabel: string
  }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 bg-band/40 rounded-xl border border-line">
      <div className="flex flex-col gap-4">
        <TextField 
          label="Number Label"
          value={form.numberLabel}
          placeholder="e.g., 01"
          onChange={e => onChange({ ...form, numberLabel: e.target.value })}
        />
        <TextField 
          label="Title"
          required
          value={form.title}
          placeholder="e.g., The Drawing"
          onChange={e => onChange({ ...form, title: e.target.value })}
        />
        <TextareaField 
          label="Description"
          value={form.description}
          placeholder="e.g., The deity set on a construction grid..."
          onChange={e => onChange({ ...form, description: e.target.value })}
          className="min-h-[100px] resize-y"
        />
        
        <div className="pt-2">
          <Checkbox
            label="Dark plate ground for image"
            checked={form.isDarkPlate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...form, isDarkPlate: e.target.checked })}
          />
        </div>
      </div>
      
      <div>
        <label className="text-xs font-semibold text-muted uppercase tracking-[0.05em] mb-2 block">Stage Image <span className="text-ink">*</span></label>
        <ImageDropzone value={form.imagePath} onChange={url => onChange({ ...form, imagePath: url })} />
      </div>

      <div className="lg:col-span-2 flex justify-end gap-3 mt-12 pt-6 border-t border-line">
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
            <BookOpen size={28} />
            The Making
          </h1>
          <p className="text-muted">Manage the "From Sketch to Silver" narrative sequence.</p>
        </div>
        <Button
          onClick={() => { setShowAddForm(v => !v); setEditingIndex(null) }}
          className="whitespace-nowrap"
          leftIcon={!showAddForm ? <Plus size={18} /> : undefined}
        >
          {showAddForm ? 'Cancel' : 'Add Stage'}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-4">New Stage</h2>
          <StageForm
            form={addForm}
            onChange={setAddForm}
            onSave={handleAdd}
            onCancel={() => { setShowAddForm(false); setAddForm(emptyForm()) }}
            saveLabel="Add Stage"
          />
        </div>
      )}

      <div className="bg-field rounded-xl border border-line shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink" />
          </div>
        ) : (
          <div className="divide-y divide-line">
            {stages.map((stage, idx) => (
              <div key={stage.id}>
                {editingIndex === idx && editForm ? (
                  <div className="p-5">
                    <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Editing — {stage.title}</p>
                    <StageForm
                      form={editForm}
                      onChange={setEditForm}
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
                      <button onClick={() => move(idx, 1)} disabled={idx === stages.length - 1}
                        className="p-1 -mx-1 text-muted hover:text-ink disabled:opacity-20 transition-[color,transform] active:scale-[0.97]" title="Move down">
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className={`w-16 h-16 shrink-0 rounded overflow-hidden relative border border-line/50 ${stage.isDarkPlate ? 'bg-vault' : 'bg-field'}`}>
                      {stage.imagePath ? (
                        <Image src={stage.imagePath} alt="" fill className="object-contain" sizes="64px" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted/50"><BookOpen size={20} /></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="font-medium text-ink truncate flex items-center gap-2">
                        {stage.numberLabel && <span className="text-xs font-mono bg-band px-1.5 py-0.5 rounded text-muted">{stage.numberLabel}</span>}
                        {stage.title}
                      </div>
                      <div className="text-sm text-muted mt-0.5 truncate max-w-lg">
                        {stage.description}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <IconButton aria-label="Edit" onClick={() => startEdit(idx)} title="Edit">
                        <Edit2 size={18} />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => setDeleteId(stage.id)} title="Delete" className="hover:text-danger">
                        <Trash2 size={18} />
                      </IconButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {stages.length === 0 && (
              <div className="py-12 text-center text-muted flex flex-col items-center">
                <BookOpen size={32} className="mb-4 opacity-20" />
                <p>No stages found in the journey narrative.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Stage"
        description="Are you sure you want to delete this narrative stage? This cannot be undone."
        footer={
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="danger" onClick={executeDelete} className="w-full sm:w-auto">Delete Stage</Button>
          </div>
        }
      />
    </div>
  )
}
