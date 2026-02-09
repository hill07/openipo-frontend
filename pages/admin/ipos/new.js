import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { adminAuthAPI } from '../../../services/adminApi';
import IPOForm from '../../../components/admin/IPOForm';
import { ArrowLeft } from 'lucide-react';
import AdminLayoutV2 from '../../../components/admin/AdminLayoutV2';

export default function NewIPO() {
    const router = useRouter();

    useEffect(() => {
        // Layout handles auth mostly, but double check or just let layout do it.
        // If Layout handles it, we can remove this. But for safety/speed:
        adminAuthAPI.getMe().catch(() => router.push('/admin/login'));
    }, [router]);

    return (
        <AdminLayoutV2 title="New IPO">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/ipos" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-white"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold text-white">Create New IPO</h1>
                </div>
                <IPOForm />
            </div>
        </AdminLayoutV2>
    );
}
