import { SET_SEARCH_QUERY, FETCH_SEARCH_SUCCESS, SET_ACTIVE_COIN } from '../actionTypes';

const initialState = {
  query: '',
  results: [],
  activeCoin: null,
};

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return { ...state, query: action.payload };
    case FETCH_SEARCH_SUCCESS:
      return { ...state, results: action.payload };
    case SET_ACTIVE_COIN:
      return { ...state, activeCoin: action.payload, query: '', results: [] };
    default:
      return state;
  }
}
