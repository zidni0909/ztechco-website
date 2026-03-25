import AdminShell from '@/components/admin/AdminShell';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <AdminShell user={{ email: session?.user?.email || '', role: (session?.user as any)?.role || 'editor' }}>
      {children}
    </AdminShell>
  );
}
