import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChartType } from '../store/actions/chartActions';

const TYPES = [
  { id: 'line', label: 'Line' },
  { id: 'bar-vertical', label: 'Bar chart vertical' },
  { id: 'bar-horizontal', label: 'Bar chart horizontal' },
];

export default function ChartTypeSelect() {
  const dispatch = useDispatch();
  const chartType = useSelector((s) => s.chart.chartType);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = TYPES.find((t) => t.id === chartType);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-base-600 bg-base-800 text-xs font-medium text-base-200"
      >
        {current?.label || 'Chart type'}
        <svg width="9" height="9" viewBox="0 0 10 10">
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-48 rounded-lg border border-base-600 bg-base-800 shadow-panel z-40 overflow-hidden">
          {TYPES.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => {
                  dispatch(setChartType(t.id));
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-base-700 transition-colors ${
                  t.id === chartType ? 'text-signal-accent2 bg-signal-accent/5' : 'text-base-200'
                }`}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
