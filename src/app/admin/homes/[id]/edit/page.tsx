"use client";
import { useParams } from 'next/navigation';
import UpdateHomeForm from '@/components/HomesPage/UpdateHomeForm';

export default function AdminHomeEditPage() {
  const params = useParams();
  const homeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!homeId) return null;

  return (
    <div className="container mx-auto">
      <UpdateHomeForm homeId={homeId} />
    </div>
  );
} 