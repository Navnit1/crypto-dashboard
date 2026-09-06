import {
  FETCH_COINS_REQUEST,
  FETCH_COINS_SUCCESS,
  FETCH_COINS_FAILURE,
} from '../actionTypes';
import { getMarkets } from '../../api/coingecko';

export const fetchCoins = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_COINS_REQUEST });
  try {
    const { currency } = getState();
    const data = await getMarkets(currency.base, 50, 1);
    dispatch({ type: FETCH_COINS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: FETCH_COINS_FAILURE,
      payload: err.message || 'Failed to load market data',
    });
  }
};
