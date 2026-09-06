import { SET_SEARCH_QUERY, FETCH_SEARCH_SUCCESS, SET_ACTIVE_COIN } from '../actionTypes';
import { searchCoins } from '../../api/coingecko';

let debounceTimer = null;

export const setSearchQuery = (query) => (dispatch) => {
  dispatch({ type: SET_SEARCH_QUERY, payload: query });
  clearTimeout(debounceTimer);
  if (!query || query.trim().length < 2) {
    dispatch({ type: FETCH_SEARCH_SUCCESS, payload: [] });
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      const data = await searchCoins(query);
      dispatch({ type: FETCH_SEARCH_SUCCESS, payload: data.coins?.slice(0, 8) || [] });
    } catch {
      dispatch({ type: FETCH_SEARCH_SUCCESS, payload: [] });
    }
  }, 350);
};

export const setActiveCoin = (coinId) => ({
  type: SET_ACTIVE_COIN,
  payload: coinId,
});
