import { describe, it, expect } from 'vitest';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../store/reducers';
import { setExchangeAmount } from '../store/actions/exchangeActions';

function makeStore() {
  return createStore(rootReducer, applyMiddleware(thunk));
}

describe('exchange amount validation', () => {
  it('accepts a plain numeric string', () => {
    const store = makeStore();
    store.dispatch(setExchangeAmount('0.25'));
    expect(store.getState().exchange.amount).toBe('0.25');
    expect(store.getState().exchange.error).toBeNull();
  });

  it('rejects non-numeric input and surfaces an error message', () => {
    const store = makeStore();
    store.dispatch(setExchangeAmount('abc'));
    expect(store.getState().exchange.error).toMatch(/numbers only/i);
  });

  it('clears the error once the field is emptied', () => {
    const store = makeStore();
    store.dispatch(setExchangeAmount('abc'));
    store.dispatch(setExchangeAmount(''));
    expect(store.getState().exchange.error).toBeNull();
    expect(store.getState().exchange.amount).toBe('');
  });
});
