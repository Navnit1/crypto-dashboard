import { combineReducers } from 'redux';
import currency from './currencyReducer';
import coins from './coinsReducer';
import chart from './chartReducer';
import exchange from './exchangeReducer';
import search from './searchReducer';

const rootReducer = combineReducers({
  currency,
  coins,
  chart,
  exchange,
  search,
});

export default rootReducer;
