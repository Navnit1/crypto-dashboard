import {
  TOGGLE_CHART_COIN,
  SET_CHART_RANGE,
  SET_CHART_TYPE,
  FETCH_CHART_REQUEST,
  FETCH_CHART_SUCCESS,
  FETCH_CHART_FAILURE,
} from '../actionTypes';

import { getMarketChart } from '../../api/coingecko';

export const setChartType = (chartType) => ({
  type: SET_CHART_TYPE,
  payload: chartType,
});

export const setChartRange = (range) => (dispatch, getState) => {
  dispatch({
    type: SET_CHART_RANGE,
    payload: range,
  });

  const { chart } = getState();

  if (chart.selectedCoins.length) {
    dispatch(fetchChartData(chart.selectedCoins, range));
  }
};

export const toggleChartCoin = (coinId) => (dispatch, getState) => {
  dispatch({
    type: TOGGLE_CHART_COIN,
    payload: coinId,
  });

  const { chart } = getState();

  const nowSelected = chart.selectedCoins.includes(coinId)
    ? chart.selectedCoins.filter((id) => id !== coinId)
    : [...chart.selectedCoins, coinId];

  if (nowSelected.length) {
    dispatch(fetchChartData(nowSelected, chart.range));
  }
};

export const fetchChartData = (coinIds, range) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: FETCH_CHART_REQUEST,
  });

  try {
    const { currency } = getState();

    const days = range === '1' ? 1 : Number(range);

    const results = await Promise.allSettled(
      coinIds.map((id) =>
        getMarketChart(id, currency.base, days).then((data) => ({
          id,
          data,
        }))
      )
    );

    const byCoin = {};

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { id, data } = result.value;

        byCoin[id] = data.prices;
      } else {
        console.error(
          'Failed to load chart data:',
          result.reason
        );
      }
    });

    if (Object.keys(byCoin).length === 0) {
      throw new Error('No historical chart data available');
    }

    dispatch({
      type: FETCH_CHART_SUCCESS,
      payload: byCoin,
    });
  } catch (err) {
    dispatch({
      type: FETCH_CHART_FAILURE,
      payload:
        err.message || 'Failed to load chart data',
    });
  }
};