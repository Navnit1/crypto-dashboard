import {
  FETCH_COINS_REQUEST,
  FETCH_COINS_SUCCESS,
  FETCH_COINS_FAILURE,
} from '../actionTypes';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export default function coinsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_COINS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_COINS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_COINS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
