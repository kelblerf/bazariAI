/** @type {import('next').NextConfig} */
const supabaseImageUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''

const remotePatterns = []

if (supabaseImageUrl) {
  const { protocol, hostname, pathname } = new URL(supabaseImageUrl)

  remotePatterns.push({
    protocol: protocol.replace(':', ''),
    hostname,
    pathname: `${pathname.replace(/\/$/, '')}/storage/v1/object/public/**`,
  })
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
}

export default nextConfig
