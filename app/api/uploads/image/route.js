import { randomUUID } from 'node:crypto'

import { requireAuthenticatedUser } from '../../_lib/auth'
import { withCorsEmpty, withCorsJson } from '../../_lib/cors'
import { getStorageBucketName, getSupabaseAdmin } from '../../../../lib/supabase-admin.js'
import { deleteStorageFilesByUrls } from '../../../../lib/storage-files.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ensureBucket = async (supabase, bucket) => {
  const { data: existing, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    throw listError
  }

  if (existing?.some((item) => item.name === bucket)) {
    return
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: '10MB',
  })

  if (createError) {
    throw createError
  }
}

const getExtension = (file) => {
  const byName = file.name?.includes('.') ? file.name.split('.').pop() : ''
  if (byName) {
    return byName.toLowerCase()
  }

  const byType = file.type?.split('/').pop()
  return byType || 'bin'
}

export async function POST(request) {
  try {
    const auth = await requireAuthenticatedUser(request)
    if (auth.response) {
      return auth.response
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return withCorsJson({ error: 'Chybi soubor pro nahrani.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const bucket = getStorageBucketName()

    await ensureBucket(supabase, bucket)

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = `listings/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${getExtension(file)}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
      cacheControl: '3600',
    })

    if (uploadError) {
      throw uploadError
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return withCorsJson({
      file_url: publicUrlData.publicUrl,
      file_path: filePath,
      bucket,
    })
  } catch (error) {
    console.error('Image upload failed', error)
    return withCorsJson(
      {
        error: 'Nepodarilo se nahrat fotografii.',
        details: error?.message || 'Unknown server error.',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAuthenticatedUser(request)
    if (auth.response) {
      return auth.response
    }

    const payload = await request.json()
    const fileUrls = payload?.file_url ? [payload.file_url] : payload?.file_urls

    const result = await deleteStorageFilesByUrls(fileUrls)

    return withCorsJson({
      success: true,
      deleted: result.deleted,
    })
  } catch (error) {
    console.error('Image delete failed', error)
    return withCorsJson(
      {
        error: 'Nepodarilo se smazat fotografii.',
        details: error?.message || 'Unknown server error.',
      },
      { status: 500 }
    )
  }
}

export function OPTIONS() {
  return withCorsEmpty()
}
