import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleChartCoin } from '../store/actions/chartActions';

export default function CoinMultiSelect() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.coins);
  const selected = useSelector((s) => s.chart.selectedCoins);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label =
    selected.length === 0
      ? 'Cryptocurrency'
      : list
          .filter((c) => selected.includes(c.id))
          .map((c) => c.name)
          .join(', ') || `${selected.length} selected`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium max-w-[220px] transition-colors ${
          selected.length
            ? 'border-signal-accent/70 text-signal-accent2 bg-signal-accent/10'
            : 'border-base-600 text-base-200 bg-base-800'
        }`}
      >
        <span className="truncate">{label}</span>
        <svg width="9" height="9" viewBox="0 0 10 10" className="shrink-0">
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-56 max-h-64 overflow-y-auto rounded-lg border border-base-600 bg-base-800 shadow-panel z-40">
          {list.map((coin) => {
            const isSelected = selected.includes(coin.id);
            return (
              <li key={coin.id}>
                <button
                  onClick={() => dispatch(toggleChartCoin(coin.id))}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-base-700 transition-colors ${
                    isSelected ? 'text-signal-accent2' : 'text-base-200'
                  }`}
                >
                  <img src={coin.image} alt="" className="w-4 h-4 rounded-full" />
                  <span className="flex-1 truncate">{coin.name}</span>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
