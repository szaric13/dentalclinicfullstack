import { IconStar } from './icons';
import { fmtDate } from './helpers';

export default function ReviewsView({ reviews, avgRating }) {
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => Math.round(r.rating) === star).length,
    }));
    const total = reviews.length || 1;

    return (
        <div className="dash-cols">
            <div className="panel">
                <div className="panel-head">
                    <div>
                        <h3>Ocene pacijenata</h3>
                        <div className="sub">{reviews.length} ukupno</div>
                    </div>
                </div>
                <div className="panel-body">
                    {reviews.length === 0 ? (
                        <div className="empty-state">
                            <IconStar width={28} height={28} />
                            <p>Još uvek nemate ocena.</p>
                        </div>
                    ) : (
                        reviews.map((r) => (
                            <div className="review-item" key={r.id}>
                                <div className="review-stars">
                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                </div>
                                <p>{r.comment || 'Bez komentara'}</p>
                                <small>{r.createdAt ? fmtDate(r.createdAt) : ''}</small>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="panel">
                <div className="panel-head"><h3>Sažetak</h3></div>
                <div className="panel-body">
                    <div className="rating-big">
                        <div className="score">{(avgRating || 0).toFixed(1)}</div>
                        <div>
                            <div className="review-stars">
                                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                            </div>
                            <small style={{ color: 'var(--c-muted)' }}>od {reviews.length} ocena</small>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                        {distribution.map(({ star, count }) => (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, width: 28, color: 'var(--c-muted)' }}>{star} ★</span>
                                <div style={{ flex: 1, height: 8, background: 'var(--c-bg-2)', borderRadius: 999 }}>
                                    <div style={{
                                        width: `${(count / total) * 100}%`,
                                        height: '100%',
                                        borderRadius: 999,
                                        background: 'linear-gradient(90deg, var(--c-primary), var(--c-accent))',
                                    }} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, width: 22, textAlign: 'right' }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
