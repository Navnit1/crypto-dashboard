import {
  SET_EXCHANGE_SELL,
  SET_EXCHANGE_BUY,
  SET_EXCHANGE_AMOUNT,
  SET_EXCHANGE_ERROR,
  FETCH_RATE_REQUEST,
  FETCH_RATE_SUCCESS,
  FETCH_RATE_FAILURE,
} from '../actionTypes';

const initialState = {
  sell: 'bitcoin',
  buy: 'ethereum',
  amount: '',
  rate: null,
  loading: false,
  error: null,
};

export default function exchangeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXCHANGE_SELL:
      return { ...state, sell: action.payload };
    case SET_EXCHANGE_BUY:
      return { ...state, buy: action.payload };
    case SET_EXCHANGE_AMOUNT:
      return { ...state, amount: action.payload };
    case SET_EXCHANGE_ERROR:
      return { ...state, error: action.payload };
    case FETCH_RATE_REQUEST:
      return { ...state, loading: true };
    case FETCH_RATE_SUCCESS:
      return { ...state, loading: false, rate: action.payload };
    case FETCH_RATE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
