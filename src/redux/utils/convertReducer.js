export default function(models, { initialState, onError, onStateChange }) {
  const result = {};
  for (const model of models) {
    const { namespace, state, reducers } = model;
    const conventedReducers = new Map();
    for (const reducerName in reducers) {
      if (reducers.hasOwnProperty(reducerName)) {
        conventedReducers.set(`${namespace}/${reducerName}`, reducers[reducerName]);
      }
    }
    const defaultState = { ...state, ...initialState[namespace] };
    result[namespace] = (state = defaultState, action) => {
      try {
        if (!conventedReducers.has(action.type)) {
          return state;
        }
        const stateChanged = conventedReducers.get(action.type)(state, action);
        onStateChange({ stateBefore: state, stateChanged, action, namespace });
        return stateChanged;
      } catch (e) {
        onError({ e, namespace, type: 'reducer', action });
        return state;
      }
    };
  }
  return result;
}
