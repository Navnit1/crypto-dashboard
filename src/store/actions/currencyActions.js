import { SET_BASE_CURRENCY } from '../actionTypes';
import { fetchCoins } from './coinsActions';
import { fetchChartData } from './chartActions';

export const setBaseCurrency = (currency) => (dispatch, getState) => {
  dispatch({ type: SET_BASE_CURRENCY, payload: currency });
  // Re-pull everything that is priced in the base currency.
  dispatch(fetchCoins());
  const { chart } = getState();
  if (chart.selectedCoins.length) {
    dispatch(fetchChartData(chart.selectedCoins, chart.range));
  }
};
