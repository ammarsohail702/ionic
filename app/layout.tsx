import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ionic - Custom Team Uniforms',
  description: 'Design your custom team uniforms with our 3D customizer. Perfect for football clubs, schools, and sports teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
