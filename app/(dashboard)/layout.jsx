import ClientLayout from './Clientlayout';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    redirect('/login');
  }

  return (
    <ClientLayout user={user}>
      {children}
    </ClientLayout>
  );
}