import ListingEditor from '../../../_components/listing-editor';

export default async function EditListingPage({ params }) {
  const { id } = await params;
  return <ListingEditor initialListingId={id} />;
}
