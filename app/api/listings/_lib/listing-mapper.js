export const toListingResponse = (record) => ({
  id: record.id,
  created_date: record.createdAt.toISOString(),
  updated_date: record.updatedAt.toISOString(),
  title: record.title,
  brand: record.brand,
  model: record.model,
  category: record.category,
  age_years: record.ageYears,
  technical_condition: record.technicalCondition,
  visual_condition: record.visualCondition,
  functionality: record.functionality,
  accessories: record.accessories,
  defects: record.defects,
  reason_for_sale: record.reasonForSale,
  location: record.location,
  delivery_method: record.deliveryMethod,
  payment_method: record.paymentMethod,
  original_price: record.originalPrice,
  desired_price: record.desiredPrice,
  notes: record.notes,
  photo_urls: record.photoUrls,
  ai_identification: record.aiIdentification,
  ai_analysis: record.aiAnalysis,
  price_research: record.priceResearch,
  generated_listings: record.generatedListings,
  status: record.status,
})

export const toListingCreateInput = (payload) => ({
  title: payload.title || 'Bez nazvu',
  brand: payload.brand || null,
  model: payload.model || null,
  category: payload.category || null,
  ageYears: payload.age_years || null,
  technicalCondition: payload.technical_condition || null,
  visualCondition: payload.visual_condition || null,
  functionality: payload.functionality || null,
  accessories: payload.accessories || null,
  defects: payload.defects || null,
  reasonForSale: payload.reason_for_sale || null,
  location: payload.location || null,
  deliveryMethod: payload.delivery_method || null,
  paymentMethod: payload.payment_method || null,
  originalPrice: stringifyValue(payload.original_price),
  desiredPrice: stringifyValue(payload.desired_price),
  notes: payload.notes || null,
  photoUrls: payload.photo_urls || [],
  aiIdentification: payload.ai_identification || null,
  aiAnalysis: payload.ai_analysis || null,
  priceResearch: payload.price_research || null,
  generatedListings: payload.generated_listings || null,
  status: payload.status || 'rozpracovany',
})

const stringifyValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return null
  }

  return String(value)
}
