import * as sagaMethods from 'redux-saga/effects';

export default function(models, { onError }) {
  let allSaga = [];
  for (let model of models) {
    if (model.effects) {
      for (let sagaName in model.effects) {
        if (model.effects.hasOwnProperty(sagaName)) {
          allSaga.push({
            name: sagaName,
            model,
          });
        }
      }
    }
  }
  function* rootSaga() {
    for (const {
      model: { namespace, effects },
      name,
    } of allSaga) {
      yield sagaMethods.takeEvery(`${namespace}/${name}`, function*(action) {
        const dispatchPromiseResolve = action[Symbol.for('dispatchPromiseResolve')];
        const dispatchPromiseReject = action[Symbol.for('dispatchPromiseReject')];
        try {
          const res = yield sagaMethods.call(effects[name], sagaMethods, action);
          if (dispatchPromiseResolve) {
            yield dispatchPromiseResolve(res);
          }
        } catch (e) {
          onError({ e, type: 'effect', namespace, action });
          if (dispatchPromiseReject) {
            yield dispatchPromiseReject(e);
          }
        }
      });
    }
  }
  return { rootSaga, allSaga };
}
