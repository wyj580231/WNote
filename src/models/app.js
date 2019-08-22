import Toast from 'react-native-root-toast';
import { login, register, uploadAvatar, modifyAccount } from '../api';
import DeviceStorage from '../utils/storgae';

export default {
  namespace: 'app',
  state: {
    themes: ['#35BD64', '#1FAB89', '#CBA1C2', '#3A1F5D', '#A4D7E1'],
    activeTheme: 0,
    user: null,
    password: null,
    useTouchID: false,
    useFaceID: false,
  },
  storeFields: ['activeTheme', 'user', 'useTouchID'],
  effects: {
    *auth(
      { put, call },
      {
        payload: { userName, password, type },
      }
    ) {
      const res = yield call(type === 'login' ? login : register, { userName, password });
      if (res && res.result === 'OK') {
        yield DeviceStorage.set('authorization', 'Bearer ' + res.data.token);
        yield put({
          type: 'app/save',
          payload: {
            user: res.data.user,
          },
        });
      } else {
        return res;
      }
    },
    *modifyPassword(
      { put, call, select },
      {
        payload: { password, callback },
      }
    ) {
      let { user } = yield select(state => state.app);
      user = { ...user, password };
      const res = yield call(modifyAccount, user);
      if (res && res.result === 'OK') {
        yield put({
          type: 'app/save',
          payload: {
            user,
          },
        });
        callback && callback();
      }
    },
    *uploadAvatar(
      { put, call, select },
      {
        payload: { path },
      }
    ) {
      const { user } = yield select(state => state.app);
      const res = yield call(uploadAvatar, path);
      if (res && res.result === 'OK') {
        yield put({ type: 'app/save', payload: { user: { ...user, avatar: res.data } } });
        Toast.show('修改成功.');
      }
    },
    *logout({ put }) {
      yield put({ type: 'note/reset' });
      yield put({ type: 'app/save', payload: { user: null } });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    changeTheme(
      state,
      {
        payload: { activeTheme },
      }
    ) {
      return { ...state, activeTheme };
    },
  },
};
