import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import convertReducers from './utils/convertReducer';
import convertSagas from './utils/convertSaga';

export default function(models = [], { initialState = {}, onStateChange = state => state, onError = e => e } = {}) {
  const { rootSaga, allSaga } = convertSagas(models, { initialState, onError, onStateChange });
  const appReducer = combineReducers(convertReducers(models, { initialState, onError, onStateChange }));
  const app = {
    store: null,
    run() {
      const sagaMiddleware = createSagaMiddleware();
      const store = createStore(appReducer, applyMiddleware(sagaMiddleware));
      const { dispatch } = store;
      store.dispatch = action => {
        return allSaga.some(v => `${v.model.namespace}/${v.name}` === action.type)
          ? new Promise((resolve, reject) =>
              dispatch({
                ...action,
                [Symbol.for('dispatchPromiseResolve')]: resolve,
                [Symbol.for('dispatchPromiseReject')]: reject,
              })
            )
          : dispatch(action);
      };
      sagaMiddleware.run(rootSaga);
      this.store = store;
      return store;
    },
  };
  return app;
}
