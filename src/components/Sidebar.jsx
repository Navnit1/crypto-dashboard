import { useSelector } from 'react-redux';
import { formatCompact, formatPercent } from '../utils/format';

export default function Sidebar() {
  const { list, loading, error } = useSelector((s) => s.coins);
  const { symbol, base } = useSelector((s) => s.currency);

  return (
    <aside className="w-full lg:w-72 shrink-0 rounded-xl border border-base-700 bg-base-900 shadow-panel p-4 flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-semibold text-sm text-base-100">
          Market cap rank
        </h2>
        <span className="text-[10px] font-mono uppercase text-base-400">{base}</span>
      </div>

      {loading && (
        <ul className="space-y-3 animate-pulse" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="h-9 rounded-md bg-base-700/60" />
          ))}
        </ul>
      )}

      {error && (
        <p className="text-signal-down text-xs font-mono">{error}</p>
      )}

      {!loading && !error && (
        <ul className="space-y-1 overflow-y-auto max-h-[520px] pr-1">
          {list.map((coin, idx) => {
            const up = (coin.price_change_percentage_24h ?? 0) >= 0;
            return (
              <li key={coin.id}>
                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-base-800 transition-colors">
                  <span className="text-[10px] font-mono text-base-500 w-4 text-right shrink-0">
                    {idx + 1}
                  </span>
                  <img src={coin.image} alt="" className="w-5 h-5 rounded-full shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-base-100 truncate leading-tight">
                      {coin.name}
                    </p>
                    <p className="text-[11px] font-mono text-base-400">
                      Mkt.Cap {symbol}
                      {formatCompact(coin.market_cap)}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-mono shrink-0 ${
                      up ? 'text-signal-up' : 'text-signal-down'
                    }`}
                  >
                    {formatPercent(coin.price_change_percentage_24h)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
