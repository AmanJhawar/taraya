export const revalidate = 3600;
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/services/inventory.service'
import { getCollectionBySlug } from '@/lib/services/collections.service'
// Product client component
import { ProductClient } from '@/components/product-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} — Taraya`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const config = await getCollectionBySlug(product.collection)

  return (
    <main className="min-h-screen bg-field pt-24 pb-16 md:pt-32">
      <ProductClient product={product} config={config} />
    </main>
  )
}
