import PlaceDetail from './PlaceDetail';

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ];
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlaceDetail placeId={id} />;
}
