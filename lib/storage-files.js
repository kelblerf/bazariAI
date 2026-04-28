import { getStorageBucketName, getSupabaseAdmin } from './supabase-admin.js'

const stripLeadingSlash = (value) => value.replace(/^\/+/, '')

export const getStoragePublicPrefix = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const bucket = getStorageBucketName()

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL in server environment.')
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/`
}

export const extractStoragePathFromUrl = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') {
    return null
  }

  if (fileUrl.startsWith('data:')) {
    return null
  }

  const prefix = getStoragePublicPrefix()
  if (!fileUrl.startsWith(prefix)) {
    return null
  }

  return stripLeadingSlash(fileUrl.slice(prefix.length))
}

export const deleteStorageFilesByUrls = async (fileUrls) => {
  const supabase = getSupabaseAdmin()
  const bucket = getStorageBucketName()
  const paths = (fileUrls || []).map(extractStoragePathFromUrl).filter(Boolean)

  if (paths.length === 0) {
    return { deleted: 0 }
  }

  const { error } = await supabase.storage.from(bucket).remove(paths)

  if (error) {
    throw error
  }

  return { deleted: paths.length }
}
