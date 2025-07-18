import Header from '@/components/Header';
import ProfileHeader from './ProfileHeader';

export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProfileHeader />
      {children}
    </div>
  );
}
