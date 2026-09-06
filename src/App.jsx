import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoins } from './store/actions/coinsActions';
import { fetchChartData } from './store/actions/chartActions';
import Header from './components/Header';
import TickerTape from './components/TickerTape';
import Sidebar from './components/Sidebar';
import ChartPanel from './components/ChartPanel';
import PortfolioPie from './components/PortfolioPie';
import ExchangeCoins from './components/ExchangeCoins';

export default function App() {
  const dispatch = useDispatch();
  const coinsError = useSelector((s) => s.coins.error);
  const selectedCoins = useSelector((s) => s.chart.selectedCoins);
  const range = useSelector((s) => s.chart.range);

  useEffect(() => {
    dispatch(fetchCoins());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(fetchChartData(selectedCoins, range));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-base-950 bg-grid bg-[size:32px_32px]">
      <Header />
      <TickerTape />

      <main className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        <Sidebar />

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {coinsError && (
            <div className="rounded-xl border border-signal-down/40 bg-signal-down/10 px-4 py-3 text-sm text-signal-down">
              Couldn't reach the market data feed — {coinsError}
            </div>
          )}
          <ChartPanel />
          <div className="flex flex-col md:flex-row gap-6">
            <PortfolioPie />
            <ExchangeCoins />
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 py-8 text-xs text-base-500 font-mono">
        Data via CoinGecko API · Built with React, Redux &amp; Tailwind CSS
      </footer>
    </div>
  );
}
