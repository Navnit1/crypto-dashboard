import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setExchangeSell,
  setExchangeBuy,
  setExchangeAmount,
  fetchExchangeRate,
} from '../store/actions/exchangeActions';

function CoinDropdown({ label, value, onChange, options, accent }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = options.find((c) => c.id === value);

  return (
    <div>
      <p className={`text-xs font-medium mb-1 ${accent}`}>{label}</p>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-base-800 border border-base-600 text-sm text-base-100"
        >
          {current?.image && <img src={current.image} alt="" className="w-4 h-4 rounded-full" />}
          <span className="flex-1 text-left truncate">{current?.name || value}</span>
          <svg width="9" height="9" viewBox="0 0 10 10" className="shrink-0 text-base-400">
            <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <ul className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-lg border border-base-600 bg-base-800 shadow-panel z-40">
            {options.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    onChange(c.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-base-700 text-base-200"
                >
                  <img src={c.image} alt="" className="w-4 h-4 rounded-full" />
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ExchangeCoins() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.coins);
  const { sell, buy, amount, rate, error, loading } = useSelector((s) => s.exchange);

  useEffect(() => {
    if (list.length) dispatch(fetchExchangeRate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  const numericAmount = parseFloat(amount);
  const converted =
    rate && !Number.isNaN(numericAmount) ? (numericAmount * rate).toFixed(6) : null;
  const sellMeta = list.find((c) => c.id === sell);

  return (
    <div className="rounded-xl border border-base-700 bg-base-900 shadow-panel p-4 lg:p-5 flex-1">
      <h2 className="font-display font-semibold text-sm text-base-100 mb-3">Exchange Coins</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <CoinDropdown
          label="Sell"
          accent="text-signal-amber"
          value={sell}
          onChange={(id) => dispatch(setExchangeSell(id))}
          options={list}
        />
        <div>
          <p className="text-xs font-medium mb-1 text-base-400">Enter value</p>
          <input
            value={amount}
            onChange={(e) => dispatch(setExchangeAmount(e.target.value))}
            placeholder={sellMeta ? `Avl: 0.00 ${sellMeta.symbol?.toUpperCase()}` : '0.00'}
            inputMode="decimal"
            className={`w-full px-3 py-2 rounded-lg bg-base-800 border text-sm font-mono text-base-100 placeholder:text-base-500 outline-none ${
              error ? 'border-signal-down' : 'border-base-600 focus:border-signal-accent/60'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <CoinDropdown
          label="Buy"
          accent="text-signal-up"
          value={buy}
          onChange={(id) => dispatch(setExchangeBuy(id))}
          options={list}
        />
        <div className="flex flex-col justify-end">
          <p className="text-xs font-medium mb-1 text-base-400">You receive</p>
          <p className="px-3 py-2 rounded-lg bg-base-800/60 border border-base-700 text-sm font-mono text-signal-up">
            {loading ? '…' : converted ?? '0.00'}
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs text-signal-down font-mono mb-3">
          {error}
        </p>
      )}

      <button
        disabled={!converted || !!error}
        className="w-full py-2.5 rounded-lg bg-signal-accent text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-signal-accent/90 transition-colors"
      >
        Exchange
      </button>
    </div>
  );
}
