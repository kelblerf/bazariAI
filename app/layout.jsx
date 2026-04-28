import './globals.css'
import AppShell from './_components/app-shell'
import AuthScreen from './_components/auth-screen'
import { AuthProvider } from './_components/auth-provider'
import { Toaster } from '../src/components/ui/sonner'

export const metadata = {
  title: 'BazariAI',
  description: 'Průvodce tvorbou bazarových inzerátů',
}

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        <AuthProvider>
          <AuthScreen>
            <AppShell>{children}</AppShell>
          </AuthScreen>
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  )
}
