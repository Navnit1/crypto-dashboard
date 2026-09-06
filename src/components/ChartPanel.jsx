import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { setChartRange, fetchChartData } from '../store/actions/chartActions';
import CoinMultiSelect from './CoinMultiSelect';
import ChartTypeSelect from './ChartTypeSelect';
import { formatCurrency } from '../utils/format';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement, Tooltip, Legend, Filler);

const RANGES = [
  { id: '1', label: '1D' },
  { id: '7', label: '1W' },
  { id: '30', label: '1M' },
  { id: '180', label: '6M' },
  { id: '365', label: '1Y' },
];

const PALETTE = ['#3FC5FF', '#FF6B7A', '#FFB454', '#2DD9A8', '#7C5CFF', '#F472B6'];

function downsample(points, maxPoints) {
  if (points.length <= maxPoints) return points;
  const step = Math.ceil(points.length / maxPoints);
  return points.filter((_, i) => i % step === 0);
}

export default function ChartPanel() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.coins);
  const { selectedCoins, range, chartType, seriesByCoin, loading } = useSelector((s) => s.chart);
  const base = useSelector((s) => s.currency.base);

  useEffect(() => {
    if (selectedCoins.length && list.length) {
      dispatch(fetchChartData(selectedCoins, range));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [list.length]);

  const isBar = chartType.startsWith('bar');
  const isHorizontal = chartType === 'bar-horizontal';
  const maxPoints = isBar ? 12 : 80;

  const { labels, datasets } = useMemo(() => {
    let labelSource = [];
    const datasets = selectedCoins.map((coinId, idx) => {
      const raw = seriesByCoin[coinId] || [];
      const sampled = downsample(raw, maxPoints);
      if (sampled.length > labelSource.length) labelSource = sampled;
      const color = PALETTE[idx % PALETTE.length];
      const coinMeta = list.find((c) => c.id === coinId);
      return {
        label: coinMeta?.name || coinId,
        data: sampled.map((p) => p[1]),
        borderColor: color,
        backgroundColor: isBar ? `${color}CC` : `${color}22`,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
        tension: 0.35,
        fill: !isBar,
        borderRadius: isBar ? 4 : 0,
      };
    });
    const labels = labelSource.map((p) => {
      const d = new Date(p[0]);
      if (range === '1') return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    return { labels, datasets };
  }, [selectedCoins, seriesByCoin, chartType, range, list, isBar, maxPoints]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isHorizontal ? 'y' : 'x',
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: 'top',
        align: 'end',
        labels: { color: '#9AA7C2', boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { family: 'Inter', size: 11 } },
      },
      tooltip: {
        backgroundColor: '#141B2B',
        borderColor: '#28324A',
        borderWidth: 1,
        titleColor: '#E8EBF2',
        bodyColor: '#C7CEE0',
        titleFont: { family: 'Space Grotesk', size: 12, weight: '600' },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed[isHorizontal ? 'x' : 'y'], base)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', display: !isHorizontal },
        ticks: { color: '#6B7A99', font: { family: 'JetBrains Mono', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)', display: isHorizontal ? false : true },
        ticks: {
          color: '#6B7A99',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (v) => formatCurrency(v, base),
        },
      },
    },
  };

  return (
    <section className="rounded-xl border border-base-700 bg-base-900 shadow-panel p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1 bg-base-800 border border-base-700 rounded-lg p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => dispatch(setChartRange(r.id))}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                range === r.id
                  ? 'bg-signal-accent/20 text-signal-accent2 border border-signal-accent/50'
                  : 'text-base-400 hover:text-base-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <CoinMultiSelect />
          <ChartTypeSelect />
        </div>
      </div>

      <div className="h-72 lg:h-80 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-signal-accent2 pulse-dot" />
          </div>
        )}
        {!selectedCoins.length && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-base-400">
            Select a cryptocurrency to plot its price.
          </div>
        )}
        {selectedCoins.length > 0 && datasets.some((d) => d.data.length > 0) && (
          isBar ? (
            <Bar data={{ labels, datasets }} options={options} />
          ) : (
            <Line data={{ labels, datasets }} options={options} />
          )
        )}
      </div>
    </section>
  );
}
