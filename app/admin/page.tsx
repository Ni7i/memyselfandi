import type { Metadata } from 'next'
import AdminClient from './AdminClient'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  const buildTime = new Date().toISOString()
  const commitHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local'
  const deployUrl = process.env.VERCEL_URL ?? 'localhost:3000'
  const env = process.env.VERCEL_ENV ?? 'development'

  return (
    <AdminClient
      buildTime={buildTime}
      commitHash={commitHash}
      deployUrl={deployUrl}
      env={env}
    />
  )
}
