import { SET_BASE_CURRENCY } from '../actionTypes';

const SYMBOLS = { usd: '$', inr: '₹', eur: '€', gbp: '£', jpy: '¥', aud: 'A$', cad: 'C$' };

const initialState = {
  base: 'usd',
  symbol: '$',
};

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BASE_CURRENCY:
      return {
        base: action.payload,
        symbol: SYMBOLS[action.payload] || action.payload.toUpperCase() + ' ',
      };
    default:
      return state;
  }
}
