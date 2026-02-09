import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
    const router = useRouter();

    const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + '/');

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Manage IPOs', path: '/admin/ipos', icon: '📅' },
        { label: 'Users', path: '/admin/users', icon: '👥' },
        { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>OpenIPO</h2>
                <span className="badge">Admin</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <style jsx>{`
                .sidebar {
                    width: 260px;
                    background: #0f172a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #1e293b;
                    position: fixed;
                    height: 100vh;
                    left: 0;
                    top: 0;
                    z-index: 50;
                }

                .sidebar-header {
                    height: 64px;
                    display: flex;
                    align-items: center;
                    padding: 0 24px;
                    border-bottom: 1px solid #1e293b;
                    gap: 12px;
                }

                h2 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #2dd4bf;
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                .badge {
                    background: #1e293b;
                    font-size: 0.7rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    font-weight: 700;
                    color: #94a3b8;
                }

                .sidebar-nav {
                    padding: 24px 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    color: #94a3b8;
                    text-decoration: none;
                    font-weight: 500;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .nav-item.active {
                    background: #008080;
                    color: white;
                }

                .icon {
                    font-size: 1.2rem;
                }
            `}</style>
        </aside>
    );
}
