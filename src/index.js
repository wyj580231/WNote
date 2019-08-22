import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import App from './App';
import theme from './config/theme';
import Loading from './components/loading';
import DeviceStorage from './utils/storgae';
import WRedux from './redux';
import app from './models/app';
import note from './models/note';

const AppRoot = () => {
  const [store, setStore] = useState(null);
  useEffect(() => {
    DeviceStorage.get('appState', {}).then(initialState => {
      const models = [app, note];
      const onError = ({ e, action, namespace }) =>
        Alert.alert(
          '系统错误',
          `namespace: ${namespace}\nactionType: ${action.type}\nmessage: ${e.message}\nstack: ${e.stack}`
        );
      const onStateChange = ({ stateChanged, namespace, stateBefore }) => {
        const model = models.find(v => v.namespace === namespace);
        let { storeFields } = model;
        storeFields = storeFields ? (storeFields === 'all' ? Object.keys(stateChanged) : storeFields) : [];
        const stateNeedStore = {};
        storeFields.forEach(key => {
          stateNeedStore[key] = stateChanged[key];
        });
        DeviceStorage.update('appState', { [namespace]: stateNeedStore });
      };
      const wApp = WRedux(models, { initialState, onError, onStateChange });
      const store = wApp.run();
      global.store = store;
      setStore(store);
    });
  }, []);
  return store ? (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MenuProvider backHandler>
          <App />
        </MenuProvider>
      </ThemeProvider>
    </Provider>
  ) : (
    <Loading />
  );
};

export default AppRoot;
