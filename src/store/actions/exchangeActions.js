import {
  SET_EXCHANGE_SELL,
  SET_EXCHANGE_BUY,
  SET_EXCHANGE_AMOUNT,
  SET_EXCHANGE_ERROR,
  FETCH_RATE_REQUEST,
  FETCH_RATE_SUCCESS,
  FETCH_RATE_FAILURE,
} from '../actionTypes';
import { getSimplePrice } from '../../api/coingecko';

export const setExchangeSell = (coinId) => (dispatch, getState) => {
  dispatch({ type: SET_EXCHANGE_SELL, payload: coinId });
  dispatch(fetchExchangeRate());
};

export const setExchangeBuy = (coinId) => (dispatch, getState) => {
  dispatch({ type: SET_EXCHANGE_BUY, payload: coinId });
  dispatch(fetchExchangeRate());
};

// Validates the raw text input is numeric before committing it to state.
export const setExchangeAmount = (rawValue) => (dispatch) => {
  if (rawValue === '') {
    dispatch({ type: SET_EXCHANGE_AMOUNT, payload: '' });
    dispatch({ type: SET_EXCHANGE_ERROR, payload: null });
    return;
  }
  const isNumeric = /^\d*\.?\d*$/.test(rawValue);
  if (!isNumeric) {
    dispatch({
      type: SET_EXCHANGE_ERROR,
      payload: 'Enter numbers only, e.g. 0.25',
    });
    return;
  }
  dispatch({ type: SET_EXCHANGE_ERROR, payload: null });
  dispatch({ type: SET_EXCHANGE_AMOUNT, payload: rawValue });
};

export const fetchExchangeRate = () => async (dispatch, getState) => {
  const { exchange } = getState();
  dispatch({ type: FETCH_RATE_REQUEST });
  try {
    const data = await getSimplePrice(
      [exchange.sell, exchange.buy],
      ['usd']
    );
    const sellUsd = data[exchange.sell]?.usd;
    const buyUsd = data[exchange.buy]?.usd;
    if (!sellUsd || !buyUsd) throw new Error('Rate unavailable');
    dispatch({ type: FETCH_RATE_SUCCESS, payload: sellUsd / buyUsd });
  } catch (err) {
    dispatch({
      type: FETCH_RATE_FAILURE,
      payload: err.message || 'Failed to load exchange rate',
    });
  }
};
