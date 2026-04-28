import { prisma } from '../../../../lib/prisma.js'
import { deleteStorageFilesByUrls } from '../../../../lib/storage-files.js'
import { requireAuthenticatedUser } from '../../_lib/auth'
import { withCorsEmpty, withCorsJson } from '../../_lib/cors'
import { toListingCreateInput, toListingResponse } from '../_lib/listing-mapper'
import { toListingOwnerInput } from '../_lib/listing-ownership'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  try {
    const auth = await requireAuthenticatedUser(_request)
    if (auth.response) {
      return auth.response
    }

    const { user } = auth
    const { id } = await params
    await prisma.listing.updateMany({
      where: { id, userId: null },
      data: toListingOwnerInput(user),
    })

    const listing = await prisma.listing.findFirst({
      where: { id, userId: user.id },
    })

    if (!listing) {
      return withCorsJson({ error: 'Inzerat nebyl nalezen.' }, { status: 404 })
    }

    return withCorsJson(toListingResponse(listing))
  } catch (error) {
    console.error('Listing detail failed', error)
    return withCorsJson(
      {
        error: 'Nepodarilo se nacist detail inzeratu.',
        details: error?.message || 'Unknown server error.',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requireAuthenticatedUser(request)
    if (auth.response) {
      return auth.response
    }

    const { user } = auth
    const { id } = await params
    await prisma.listing.updateMany({
      where: { id, userId: null },
      data: toListingOwnerInput(user),
    })

    const existing = await prisma.listing.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return withCorsJson({ error: 'Inzerat nebyl nalezen.' }, { status: 404 })
    }

    const payload = await request.json()
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...toListingCreateInput(payload),
        userId: user.id,
        userEmail: user.email || null,
      },
    })

    return withCorsJson(toListingResponse(updated))
  } catch (error) {
    console.error('Listing update failed', error)
    return withCorsJson(
      {
        error: 'Nepodarilo se upravit inzerat.',
        details: error?.message || 'Unknown server error.',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_request, { params }) {
  try {
    const auth = await requireAuthenticatedUser(_request)
    if (auth.response) {
      return auth.response
    }

    const { user } = auth
    const { id } = await params
    await prisma.listing.updateMany({
      where: { id, userId: null },
      data: toListingOwnerInput(user),
    })

    const existing = await prisma.listing.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return withCorsJson({ error: 'Inzerat nebyl nalezen.' }, { status: 404 })
    }

    await deleteStorageFilesByUrls(existing.photoUrls || [])

    await prisma.listing.delete({
      where: { id },
    })

    return withCorsJson({ success: true })
  } catch (error) {
    console.error('Listing delete failed', error)
    return withCorsJson(
      {
        error: 'Nepodarilo se smazat inzerat.',
        details: error?.message || 'Unknown server error.',
      },
      { status: 500 }
    )
  }
}

export function OPTIONS() {
  return withCorsEmpty()
}
