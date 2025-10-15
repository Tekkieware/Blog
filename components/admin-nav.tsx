
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminNav() {
  return (
    <div className="flex container gap-4 my-4">
      <Button asChild variant="outline">
        <Link href="/admin">Dashboard</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/admin/newsletter">Newsletter</Link>
      </Button>
    </div>
  );
}
