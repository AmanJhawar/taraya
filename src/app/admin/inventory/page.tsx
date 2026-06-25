"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Trash2, Plus, Box, Edit2, X, RefreshCw } from 'lucide-react'
import { ImageDropzone } from '@/components/image-dropzone'
import { TextField, TextareaField, Button, IconButton, SelectField, Toggle } from '@/components/ui'

import { getOptimizedUrl } from '@/lib/utils'
import { Dialog } from '@/components/ui'
import { useInventoryForm } from '@/hooks/use-inventory-form'
import { type CollectionConfig } from '@/lib/domain/collections'
import {
  getStandardSizeMatrix,
  getCustomSizeMatrix,
  getSizeMatrix
} from '@/lib/domain/inventory'
import { usesStones, usesPurity, usesWeights } from '@/lib/services/collections.service'

const STANDARD_SIZES = ['4cm', '7cm', '10cm', '12.5cm']
const STANDARD_PURITIES = ['92.5', '80.0']
const STANDARD_STONES = [
  'White Quartz', 'Aventurine Quartz', 'Rose Quartz', 'Lapis Lazuli',
  'Tiger Eye', 'Black Tourmaline', 'Amethyst', 'Blue Agate'
]
const STANDARD_WEIGHTS = ['10g', '20g', '50g', '100g']

export default function AdminInventory() {
  const { state, actions } = useInventoryForm()

  const {
    items, loading, isFormOpen, editingId, deleteId,
    formData, customSizeInput, customPurityInput,
    variantSkuInputs, variantWeightInputs, variantImageInputs,
    combos, collections, nextCursor, isFetchingMore
  } = state

  const {
    loadMore, setIsFormOpen, setDeleteId, setFormData,
    setCustomSizeInput, setCustomPurityInput,
    setVariantSkuInputs, setVariantWeightInputs, setVariantImageInputs,
    cleanupOrphanedInputs, executeDelete, handleEdit, handleCancel, handleSave,
    toggleSize, togglePurity, addCustomSize, removeCustomSize,
    addCustomPurity, removeCustomPurity, numericFilter
  } = actions

  const confirmDelete = (id: string) => setDeleteId(id)

  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail === '/admin/inventory') {
        handleCancel()
      }
    }
    window.addEventListener('admin-nav-click', handleNavClick)
    return () => window.removeEventListener('admin-nav-click', handleNavClick)
  }, [handleCancel])

  const activeConfig = collections.find(c => c.slug === formData.collection)
  const isStones = usesStones(activeConfig)
  const isWeights = usesWeights(activeConfig)
  const isPurity = usesPurity(activeConfig)
  const isBullion = !!isWeights

  const collectionOptions = collections.map(c => ({ value: c.slug, label: c.title }))

  return (
    <div>
      {!isFormOpen && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight flex items-center gap-3 font-serif">
              <Box size={28} />
              Inventory Manager
            </h1>
            <p className="text-muted">Manage inventory products, sizes and purity variants.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">

            <Button
              onClick={() => setIsFormOpen(true)}
              className="whitespace-nowrap"
              leftIcon={<Plus size={18} />}
            >
              Add Product
            </Button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="bg-field p-6 rounded-xl border border-line shadow-sm mb-8 animate-[fadeInUp_300ms_var(--ease-out)_forwards]">
          <h2 className="text-xl font-semibold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Row 1: Slug + SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextField 
                  label="URL Key (ID)"
                  required
                  disabled={!!editingId}
                  value={formData.id || ''}
                  onChange={e => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                  className={!!editingId ? 'bg-band text-muted cursor-not-allowed' : ''}
                  placeholder="e.g., modern-chair"
                />
              </div>
              <div>
                <TextField 
                  label="SKU (Internal Code)"
                  required={!formData.hasVariants}
                  disabled={formData.hasVariants}
                  value={formData.hasVariants ? 'Configured per variant' : (formData.sku || '')}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  className={formData.hasVariants ? 'bg-band text-muted cursor-not-allowed' : ''}
                  placeholder="e.g., Taraya-001"
                />
              </div>
            </div>

            {/* Row 2: Name + Collection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextField 
                  label="Product Name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Elegance Marble Vase"
                />
              </div>
              <div className="flex flex-col">
                <SelectField
                  label="Collection"
                  value={formData.collection ?? ''}
                  onChange={(v) => setFormData({ ...formData, collection: v })}
                  options={[
                    { value: '', label: 'Select collection', disabled: true },
                    ...collectionOptions
                  ]}
                  disabled={!!editingId}
                />
                {!!editingId && <p className="text-[11px] text-muted mt-1.5">Collection cannot be changed after creation.</p>}
              </div>
            </div>

            {/* ─── Variant Configuration ─── */}
            <div className="border border-line rounded-xl overflow-hidden transition-[background-color,border-color,transform] duration-200 ease-[var(--ease-out)]">
              <div className={`p-5 flex items-center justify-between transition-colors duration-200 ${formData.hasVariants ? 'border-b border-line bg-band/50' : ''}`}>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Inventory Variants</h3>
                  <p className="text-xs text-muted mt-0.5">Configure sizes, purities, or specific stones/weights.</p>
                </div>
                <Toggle
                  checked={!!formData.hasVariants}
                  onChange={(checked: boolean) => {
                    const newFormData = { ...formData, hasVariants: checked }
                    setFormData(newFormData)
                    if (!newFormData.hasVariants) cleanupOrphanedInputs(newFormData)
                  }}
                  label="Toggle variants"
                />
              </div>

              {formData.hasVariants && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-field">
                  {/* ── Size Column ── */}
                  <div className={!isPurity ? 'md:col-span-2' : ''}>
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-4">
                      {isStones ? 'Available Stones' : isWeights ? 'Available Weights' : 'Available Sizes'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Array.from(new Set([
                        ...(isStones
                          ? STANDARD_STONES
                          : isWeights
                            ? STANDARD_WEIGHTS
                            : STANDARD_SIZES),
                        ...getStandardSizeMatrix(formData, activeConfig)
                      ])).map(opt => (
                        <button
                          key={opt} type="button"
                          onClick={() => toggleSize(opt)}
                          className={`admin-pill ${getStandardSizeMatrix(formData, activeConfig).includes(opt) ? 'admin-pill-active' : ''}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Custom sizes already added */}
                    {getCustomSizeMatrix(formData, activeConfig).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getCustomSizeMatrix(formData, activeConfig).map(s => (
                          <span key={s} className="admin-pill admin-pill-active flex items-center gap-1.5">
                            {s}
                            <button type="button" onClick={() => removeCustomSize(s)} className="opacity-60 hover:opacity-100 transition-[opacity,transform] active:scale-[0.97]"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-3">
                      {isStones ? 'Custom Stone' : isWeights ? 'Custom Weight' : 'Custom Size'}
                    </p>
                    <div className="flex items-end gap-3 max-w-sm">
                      <div className="flex-1">
                        <TextField
                          className="border-t-0 border-x-0 rounded-none border-b focus:ring-0 px-0 h-10"
                          value={customSizeInput}
                          onChange={e => setCustomSizeInput(isStones ? e.target.value : numericFilter(e.target.value))}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize() } }}
                          placeholder={isStones ? "e.g., Rose Quartz" : isWeights ? "e.g., 100" : "e.g., 20"}
                        />
                      </div>
                      <Button variant="secondary" onClick={addCustomSize}>
                        ADD
                      </Button>
                    </div>
                  </div>

                  {/* ── Purity Column ── */}
                  {isPurity && (
                    <div>
                      <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-4">Available Purities</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {Array.from(new Set([...STANDARD_PURITIES, ...(formData.standardPurities || [])])).map(p => (
                          <button
                            key={p} type="button"
                            onClick={() => togglePurity(p)}
                            className={`admin-pill ${(formData.standardPurities || []).includes(p) ? 'admin-pill-active' : ''}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      {/* Custom purities already added */}
                      {(formData.customPurities || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(formData.customPurities || []).map(p => (
                            <span key={p} className="admin-pill admin-pill-active flex items-center gap-1.5">
                              {p}
                              <button type="button" onClick={() => removeCustomPurity(p)} className="opacity-60 hover:opacity-100 transition-[opacity,transform] active:scale-[0.97]"><X size={12} /></button>
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-3">Custom Purity</p>
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <TextField
                            className="border-t-0 border-x-0 rounded-none border-b focus:ring-0 px-0 h-10"
                            value={customPurityInput}
                            onChange={e => setCustomPurityInput(numericFilter(e.target.value))}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomPurity() } }}
                            placeholder="e.g., 99.9"
                          />
                        </div>
                        <Button variant="secondary" onClick={addCustomPurity}>
                          ADD
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Per-Variant SKUs & Weights ── */}
              {formData.hasVariants && (() => {


                if (combos.length === 0) {
                  return (
                    <div className="px-6 pb-6 bg-field">
                      <div className="pt-6 border-t border-line">
                        <p className="text-sm text-muted italic">
                          {isStones
                            ? 'Select at least one stone to configure variant SKUs.'
                            : isBullion
                              ? 'Select at least one weight to configure variant SKUs.'
                              : 'Select at least one size and one purity to configure variant SKUs and weights.'}
                        </p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div className="px-6 pb-6 bg-field">
                    <div className="pt-6 border-t border-line">
                      <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-4">
                        {isBullion ? 'Variant SKUs' : 'Variant SKUs & Approx Weights'}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {combos.map(combo => (
                          <div key={combo.key} className="p-4 bg-field rounded-xl border border-line space-y-3">
                            <span className="text-[11px] font-semibold text-ink uppercase tracking-widest block">{combo.label}</span>
                            <div className={isBullion ? '' : 'grid grid-cols-2 gap-3'}>
                              <div>
                                <TextField
                                  label="SKU"
                                  value={variantSkuInputs[combo.key] || ''}
                                  onChange={e => setVariantSkuInputs({ ...variantSkuInputs, [combo.key]: e.target.value })}
                                  placeholder="e.g., Taraya-001-S"
                                />
                              </div>
                              {!isBullion && (
                                <div>
                                  <TextField
                                    label="Approx Weight"
                                    value={variantWeightInputs[combo.key] || ''}
                                    onChange={e => setVariantWeightInputs({ ...variantWeightInputs, [combo.key]: numericFilter(e.target.value) })}
                                    placeholder="e.g., 50"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-line">
                              <div>
                                <label className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                                  {isStones || isBullion ? 'Image Overrides (All)' : 'Image Override (Last Image)'}
                                </label>
                                <p className="text-[10px] text-muted mt-0.5 mb-2 leading-tight">
                                  {isStones || isBullion
                                    ? 'These images will completely replace the default product gallery when this variant is selected.'
                                    : 'This image will replace ONLY the last slide of the product gallery when this variant is selected.'}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {(() => {
                                  const isFullOverride = isStones || isBullion
                                  const currentImages = variantImageInputs[combo.key] || []

                                  if (!isFullOverride) {
                                    return (
                                      <ImageDropzone
                                        value={currentImages[0] || ''}
                                        onChange={url => setVariantImageInputs({ ...variantImageInputs, [combo.key]: url ? [url] : [] })}
                                      />
                                    )
                                  }

                                  return (
                                    <>
                                      {currentImages.map((img, idx) => (
                                        <ImageDropzone
                                          key={idx}
                                          value={img}
                                          onChange={url => {
                                            const newImgs = [...currentImages]
                                            if (url) newImgs[idx] = url
                                            else newImgs.splice(idx, 1)
                                            setVariantImageInputs({ ...variantImageInputs, [combo.key]: newImgs })
                                          }}
                                        />
                                      ))}
                                      {currentImages.length < 4 && (
                                        <ImageDropzone
                                          value=""
                                          onChange={url => {
                                            if (url) setVariantImageInputs({ ...variantImageInputs, [combo.key]: [...currentImages, url] })
                                          }}
                                        />
                                      )}
                                    </>
                                  )
                                })()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Row 3: Weight + Material + Display Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <TextField 
                  label="Approx Weight"
                  required={!formData.hasVariants}
                  disabled={formData.hasVariants}
                  value={formData.hasVariants ? 'Configured per variant' : (formData.weight || '')}
                  onChange={e => setFormData({ ...formData, weight: e.target.value })}
                  className={formData.hasVariants ? 'bg-band text-muted cursor-not-allowed' : ''}
                  placeholder="e.g., 2.5 kg"
                />
              </div>
              <div>
                <TextField 
                  label="Material (Optional)"
                  value={formData.material || ''}
                  onChange={e => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., 999 Pure Silver"
                />
              </div>
              <div>
                <TextField 
                  label="Display Order (Optional)"
                  type="number"
                  value={formData.orderIndex ?? ''}
                  onChange={e => setFormData({ ...formData, orderIndex: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                  placeholder="Lowest numbers first"
                />
              </div>
            </div>

            {/* Row 4: Description */}
            <div>
              <TextareaField 
                label="Description"
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="resize-none"
                placeholder="Enter detailed product description, materials used, and care instructions..."
              />
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-[0.05em] mb-2 block">Thumbnail Image (3:4 Portrait) <span className="text-ink">*</span></label>
                <ImageDropzone
                  value={formData.imageFile || ''}
                  onChange={(url) => setFormData({ ...formData, imageFile: url })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-[0.05em] mb-2 block">Product Images (4:3 Landscape)</label>
                <div className="grid grid-cols-1 gap-6">
                  {(formData.additionalImages || []).map((img, idx) => (
                    <ImageDropzone
                      key={idx}
                      value={img}
                      onChange={(url) => {
                        const newImages = [...(formData.additionalImages || [])]
                        if (url) {
                          newImages[idx] = url
                        } else {
                          newImages.splice(idx, 1)
                        }
                        setFormData({ ...formData, additionalImages: newImages })
                      }}
                    />
                  ))}
                  {(formData.additionalImages || []).length < 4 && (
                    <ImageDropzone
                      value=""
                      onChange={(url) => {
                        if (url) {
                          setFormData({ ...formData, additionalImages: [...(formData.additionalImages || []), url] })
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-line">
              <Button variant="secondary" onClick={handleCancel} className="px-6">
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Product' : 'Save Product'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Table ─── */}
      {!isFormOpen && (
        loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
          </div>
        ) : (
          <div className="bg-field rounded-xl border border-line overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-band border-b border-line">
                    <th className="px-6 py-4 text-sm font-semibold text-muted">Image</th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted">Product / SKU</th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted whitespace-nowrap">Collection</th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted">Variants</th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted">Purities</th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted">Weight</th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const itemConfig = collections.find(c => c.slug === item.collection)
                    const allSizes = getSizeMatrix(item, itemConfig)
                    const allPurities = [...(item.standardPurities || []), ...(item.customPurities || [])]
                    return (
                      <tr key={item.id} className="border-b border-line hover:bg-band/50">
                        <td className="px-6 py-4">
                          {Boolean(item.imageFile) && item.imageFile.trim() !== '' ? (
                            <Image unoptimized width={48} height={64} src={getOptimizedUrl(item.imageFile, 400)} alt="Product" className="w-12 h-auto aspect-[3/4] object-cover rounded-lg bg-band" />
                          ) : (
                            <div className="w-12 h-auto aspect-[3/4] bg-band rounded-lg flex items-center justify-center">
                              <Box size={20} className="text-muted" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-ink">{item.name}</div>
                          <div className="text-xs text-muted mt-1">{item.sku} · /{item.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-band text-muted px-2 py-1 rounded-lg whitespace-nowrap">{item.collection}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {allSizes.length > 0 ? allSizes.map(s => (
                              <span key={s} className="text-xs border border-line px-1.5 py-0.5 rounded">{s}</span>
                            )) : <span className="text-xs text-muted">—</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {allPurities.length > 0 ? allPurities.map(p => (
                              <span key={p} className="text-xs border border-line px-1.5 py-0.5 rounded">{p}{p !== '—' && !p.endsWith('%') ? '%' : ''}</span>
                            )) : <span className="text-xs text-muted">—</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-ink">{item.weight ? item.weight : <span className="text-muted">—</span>}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <IconButton aria-label="Edit" onClick={() => handleEdit(item)} title="Edit">
                              <Edit2 size={18} />
                            </IconButton>
                            <IconButton aria-label="Delete" onClick={() => confirmDelete(item.id)} title="Delete" className="hover:text-danger">
                              <Trash2 size={18} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-muted">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {nextCursor && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={loadMore}
                  disabled={isFetchingMore}
                  className="min-w-[140px]"
                >
                  {isFetchingMore ? <div className="w-5 h-5 border-2 border-muted border-t-ink rounded-full animate-spin" /> : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )
      )}

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? The live site might take a moment to reflect the change as caches clear."
        footer={
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button variant="danger" onClick={executeDelete} className="w-full sm:w-auto">Delete</Button>
          </div>
        }
      />
    </div>
  )
}
