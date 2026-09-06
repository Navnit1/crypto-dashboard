import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

// Demo holdings — in a production build this would come from a connected
// wallet or exchange account rather than being hard-coded.
const HOLDINGS = [
  { id: 'tether', label: 'Tether', value: 375, color: '#2DD9A8' },
  { id: 'terra-luna-2', label: 'Luna', value: 375, color: '#FF6B7A' },
  { id: 'ethereum', label: 'Ethereum', value: 250, color: '#3FC5FF' },
];

export default function PortfolioPie() {
  const base = useSelector((s) => s.currency.base);
  const total = HOLDINGS.reduce((sum, h) => sum + h.value, 0);

  const data = useMemo(
    () => ({
      labels: HOLDINGS.map((h) => h.label),
      datasets: [
        {
          data: HOLDINGS.map((h) => h.value),
          backgroundColor: HOLDINGS.map((h) => h.color),
          borderColor: '#0F1521',
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    }),
    []
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#141B2B',
        borderColor: '#28324A',
        borderWidth: 1,
        titleColor: '#E8EBF2',
        bodyColor: '#C7CEE0',
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed, base)}`,
        },
      },
    },
  };

  return (
    <div className="rounded-xl border border-base-700 bg-base-900 shadow-panel p-4 lg:p-5 flex-1">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-semibold text-sm text-base-100">Portfolio</h2>
        <span className="text-xs text-base-400">
          Total value <span className="text-base-100 font-mono">{formatCurrency(total, 'usd')}</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 shrink-0">
          <Doughnut data={data} options={options} />
        </div>
        <ul className="space-y-2 flex-1">
          {HOLDINGS.map((h) => (
            <li key={h.id} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: h.color }}
              />
              <span className="text-base-200 flex-1">{h.label}</span>
              <span className="font-mono text-base-100">${h.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
