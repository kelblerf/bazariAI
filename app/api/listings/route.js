import { prisma } from '../../../lib/prisma.js'
import { requireAuthenticatedUser } from '../_lib/auth'
import { withCorsEmpty, withCorsJson } from '../_lib/cors'
import { toListingCreateInput, toListingResponse } from './_lib/listing-mapper'
import { toListingOwnerInput } from './_lib/listing-ownership'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const auth = await requireAuthenticatedUser(request)
    if (auth.response) {
      return auth.response
    }

    const { user } = auth
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy')
    const limit = Number(searchParams.get('limit') || '0')

    await prisma.listing.updateMany({
      where: { userId: null },
      data: toListingOwnerInput(user),
    })

    const listings = await prisma.listing.findMany({
      where: { userId: user.id },
      orderBy: sortBy === '-created_date' ? { createdAt: 'desc' } : { createdAt: 'asc' },
      ...(limit > 0 ? { take: limit } : {}),
    })

    return withCorsJson(listings.map(toListingResponse))
  } catch (error) {
    console.error('Listings fetch failed', error)
    return withCorsJson(
      {
        error: 'Nepodarilo se nacist inzeraty.',
        details: error?.message || 'Unknown server error.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const auth = await requireAuthenticatedUser(request)
    if (auth.response) {
      return auth.response
    }

    const { user } = auth
    const payload = await request.json()
    const created = await prisma.listing.create({
      data: {
        ...toListingCreateInput(payload),
        ...toListingOwnerInput(user),
      },
    })

    return withCorsJson(toListingResponse(created), { status: 201 })
  } catch (error) {
    console.error('Listing create failed', error)
    return withCorsJson(
      {
        error: 'Nepodarilo se ulozit inzerat.',
        details: error?.message || 'Unknown server error.',
      },
      { status: 500 }
    )
  }
}

export function OPTIONS() {
  return withCorsEmpty()
}
