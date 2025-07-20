import PlaceCard from '@/components/places/PlaceCard';
import { PlaceWithUserAction } from '@/types/place.type';

export default function PlaceCardWrapper({ item }: { item: any }) {
  const place: PlaceWithUserAction = {
    ...item,
  };
  return <PlaceCard place={place} />;
}
