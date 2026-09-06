import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBaseCurrency } from '../store/actions/currencyActions';
import { setSearchQuery, setActiveCoin } from '../store/actions/searchActions';

const CURRENCIES = [
  { code: 'usd', label: 'USD' },
  { code: 'inr', label: 'INR' },
  { code: 'eur', label: 'EUR' },
  { code: 'gbp', label: 'GBP' },
  { code: 'jpy', label: 'JPY' },
  { code: 'aud', label: 'AUD' },
  { code: 'cad', label: 'CAD' },
];

export default function Header() {
  const dispatch = useDispatch();
  const base = useSelector((s) => s.currency.base);
  const { query, results } = useSelector((s) => s.search);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const currencyRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="flex items-center gap-4 px-6 py-4 border-b border-base-700/60 bg-base-950/80 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-signal-accent to-signal-accent2 flex items-center justify-center font-display font-bold text-sm text-base-950">
          C
        </div>
        <div className="leading-none">
          <p className="font-display font-semibold text-base text-base-100 tracking-tight">
            Coinboard
          </p>
          <p className="text-[10px] text-base-400 font-mono tracking-widest uppercase">
            terminal
          </p>
        </div>
      </div>

      {/* Base currency selector */}
      <div className="relative" ref={currencyRef}>
        <button
          onClick={() => setCurrencyOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-base-600 bg-base-800 text-sm font-mono uppercase text-base-200 hover:border-signal-accent/60 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={currencyOpen}
        >
          {base}
          <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`}>
            <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {currencyOpen && (
          <ul
            role="listbox"
            className="absolute mt-1 w-32 rounded-lg border border-base-600 bg-base-800 shadow-panel overflow-hidden z-40"
          >
            {CURRENCIES.map((c) => (
              <li key={c.code}>
                <button
                  onClick={() => {
                    dispatch(setBaseCurrency(c.code));
                    setCurrencyOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-mono hover:bg-base-700 transition-colors ${
                    c.code === base ? 'text-signal-accent2' : 'text-base-200'
                  }`}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-base-600 bg-base-800 focus-within:border-signal-accent/60 transition-colors">
          <svg width="15" height="15" viewBox="0 0 15 15" className="text-base-400 shrink-0">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Search by coin"
            className="bg-transparent outline-none text-sm text-base-100 placeholder:text-base-400 w-full"
          />
        </div>
        {searchFocused && results.length > 0 && (
          <ul className="absolute mt-1 w-full rounded-lg border border-base-600 bg-base-800 shadow-panel overflow-hidden z-40 max-h-72 overflow-y-auto">
            {results.map((coin) => (
              <li key={coin.id}>
                <button
                  onClick={() => dispatch(setActiveCoin(coin.id))}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-base-700 transition-colors"
                >
                  {coin.thumb && (
                    <img src={coin.thumb} alt="" className="w-4 h-4 rounded-full" />
                  )}
                  <span className="text-base-100">{coin.name}</span>
                  <span className="text-base-400 font-mono text-xs uppercase ml-auto">
                    {coin.symbol}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
