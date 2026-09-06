import { useSelector } from 'react-redux';
import { formatCurrency, formatPercent } from '../utils/format';

export default function TickerTape() {
  const { list } = useSelector((s) => s.coins);
  const base = useSelector((s) => s.currency.base);

  const top = list.slice(0, 12);
  if (!top.length) return null;

  const renderItems = (keyPrefix) =>
    top.map((coin) => {
      const up = (coin.price_change_percentage_24h ?? 0) >= 0;
      return (
        <span
          key={`${keyPrefix}-${coin.id}`}
          className="flex items-center gap-2 px-4 font-mono text-xs whitespace-nowrap"
        >
          <span className="text-base-300 uppercase">{coin.symbol}</span>
          <span className="text-base-100 font-tabular">
            {formatCurrency(coin.current_price, base)}
          </span>
          <span className={up ? 'text-signal-up' : 'text-signal-down'}>
            {formatPercent(coin.price_change_percentage_24h)}
          </span>
          <span className="text-base-600">/</span>
        </span>
      );
    });

  return (
    <div className="border-b border-base-700/60 bg-base-900 overflow-hidden">
      <div className="flex ticker-track w-max py-2">
        {renderItems('a')}
        {renderItems('b')}
      </div>
    </div>
  );
}
