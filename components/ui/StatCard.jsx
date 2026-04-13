import Link from 'next/link';

export default function StatCard({ label, value, color, href, loading }) {
    const Content = (
        <div className="ui-stat-card" style={{ '--c': color }}>
        <div className="ui-stat-num">
            {loading ? <span className="ui-skel" /> : (value ?? '-')}
        </div>
        <div className="ui-stat-lbl">{label}</div>
        </div>
    );

    return (
        <>
        <style>{`
            .ui-stat-card { display: flex; flex-direction: column; justify-content: center; background: #fff; border-radius: 12px; padding: 20px 24px; box-shadow: 0 1px 8px rgba(0,0,0,.06); transition: all .2s; border-left: 4px solid var(--c); height: 100%; }
            .ui-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); transform: translateY(-2px); }
            .ui-stat-num { font-size: 32px; font-weight: 800; color: var(--c); line-height: 1; }
            .ui-stat-lbl { font-size: 13px; color: #7a8b9a; margin-top: 6px; font-weight: 500; }
            .ui-skel { display: inline-block; width: 50px; height: 28px; background: #eef2f7; border-radius: 6px; animation: pulse 1.2s infinite; }
        `}</style>
        {href ? <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{Content}</Link> : Content}
        </>
    );
}