import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { adminIpoAPI } from '../../../../services/adminApi';
import IPOForm from '../../../../components/admin/IPOForm';
import { ArrowLeft } from 'lucide-react';
import AdminLayoutV2 from '../../../../components/admin/AdminLayoutV2';

export default function EditIPO() {
    const router = useRouter();
    const { slug } = router.query;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        adminIpoAPI.get(slug).then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [slug]);

    if (loading) return (
        <AdminLayoutV2 title="Edit IPO">
            <div className="p-10 text-white text-center">Loading Data...</div>
        </AdminLayoutV2>
    );

    return (
        <AdminLayoutV2 title="Edit IPO">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/ipos" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-white"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold truncate text-white">Edit: {data?.companyName}</h1>
                </div>

                <IPOForm initialData={data} isEdit={true} />
            </div>
        </AdminLayoutV2>
    );
}
