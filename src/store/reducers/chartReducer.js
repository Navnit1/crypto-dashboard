import {
  TOGGLE_CHART_COIN,
  SET_CHART_RANGE,
  SET_CHART_TYPE,
  FETCH_CHART_REQUEST,
  FETCH_CHART_SUCCESS,
  FETCH_CHART_FAILURE,
} from '../actionTypes';

const initialState = {
  selectedCoins: ['btc-bitcoin'],
  range: '7',
  chartType: 'line',
  seriesByCoin: {},
  loading: false,
  error: null,
};

export default function chartReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_CHART_COIN: {
      const exists = state.selectedCoins.includes(action.payload);

      const selectedCoins = exists
        ? state.selectedCoins.filter((id) => id !== action.payload)
        : [...state.selectedCoins, action.payload];

      return { ...state, selectedCoins };
    }

    case SET_CHART_RANGE:
      return { ...state, range: action.payload };

    case SET_CHART_TYPE:
      return { ...state, chartType: action.payload };

    case FETCH_CHART_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_CHART_SUCCESS:
      return {
        ...state,
        loading: false,
        seriesByCoin: { ...state.seriesByCoin, ...action.payload },
      };

    case FETCH_CHART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}