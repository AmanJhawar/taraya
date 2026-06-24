import { auth } from '@/lib/firebase/auth'

/**
 * Best-effort, authenticated on-demand revalidation.
 *
 * Extracted from the two hand-rolled copies in inventory.service. Same contract:
 * grab the current user's ID token, call /api/revalidate once per path, and warn
 * (never throw) on failure so a revalidation hiccup cannot fail the write that
 * already succeeded. Paths are revalidated in parallel.
 */
export async function revalidatePaths(paths: string[]): Promise<void> {
  if (paths.length === 0) return

  const token = await auth.currentUser?.getIdToken()
  if (!token) {
    console.error('No auth token available for revalidation.')
    return
  }

  await Promise.all(
    paths.map(async (path) => {
      try {
        const res = await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) console.warn(`Failed to revalidate ${path} — continuing.`)
      } catch (err) {
        console.warn(`Failed to revalidate ${path} — continuing.`, err)
      }
    }),
  )
}
