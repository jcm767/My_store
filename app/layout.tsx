import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Store',
  description: 'Minimal Supabase + Stripe demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial' }}>
        {children}
      </body>
    </html>
  )
}

