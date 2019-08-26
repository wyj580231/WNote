import produce from 'immer';
import dayjs from 'dayjs';
import Toast from 'react-native-root-toast';
import { syncNotes, syncBooks, syncPasswordNotes } from '../api';

const initialState = {
  passwordNotes: [],
  notes: [],
  books: [],
};
/**
 * 状态枚举
 * 0:none
 * 1:updated
 * 2:added
 * 3:deleted
 */
export default {
  namespace: 'note',
  state: initialState,
  storeFields: 'all',
  effects: {
    *syncAllData({ put, call, select, all }, action) {
      let {
        note: { notes, books, passwordNotes },
        app: { user },
      } = yield select();
      if (!user) return Toast.show('请先登录');
      const bookSyncData = {
        updated: books.filter(v => v.status === 1),
        added: books.filter(v => v.status === 2),
        deleted: books.filter(v => v.status === 3),
      };
      const passwordSyncData = {
        updated: passwordNotes.filter(v => v.status === 1),
        added: passwordNotes.filter(v => v.status === 2),
        deleted: passwordNotes.filter(v => v.status === 3),
      };
      let res1, res2, res3;
      if (bookSyncData.added.length > 0) {
        res1 = yield call(syncBooks, bookSyncData);
        notes = notes.map(v => {
          const book = res1.data.find(v1 => v1.clientID === v.bookID);
          return { ...v, bookID: book.id };
        });
        const noteSyncData = {
          updated: notes.filter(v => v.status === 1),
          added: notes.filter(v => v.status === 2),
          deleted: notes.filter(v => v.status === 3),
        };
        [res2, res3] = yield all([call(syncPasswordNotes, passwordSyncData), call(syncNotes, noteSyncData)]);
      } else {
        const noteSyncData = {
          updated: notes.filter(v => v.status === 1),
          added: notes.filter(v => v.status === 2),
          deleted: notes.filter(v => v.status === 3),
        };
        [res1, res2, res3] = yield all([
          call(syncBooks, bookSyncData),
          call(syncPasswordNotes, passwordSyncData),
          call(syncNotes, noteSyncData),
        ]);
      }
      if (res1 && res2 && res3) {
        yield put({
          type: 'note/save',
          payload: {
            books: res1.data.map(v => ({ ...v, status: 0 })),
            passwordNotes: res2.data.map(v => ({ ...v, status: 0 })),
            notes: res3.data.map(v => ({ ...v, status: 0 })),
          },
        });
        Toast.show('同步成功.');
        const callback = action.payload && action.payload.callback;
        callback && callback();
      }
    },
  },
  reducers: {
    reset() {
      return { ...initialState };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    deletePasswordNote(
      state,
      {
        payload: { id },
      }
    ) {
      let { passwordNotes } = state;
      passwordNotes = produce(passwordNotes, state => {
        const index = state.findIndex(v => v.id === id);
        state[index] = { ...state[index], status: 3, mtime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
      });
      return { ...state, passwordNotes };
    },
    updatePasswordNote(state, { payload }) {
      let { passwordNotes } = state;
      passwordNotes = produce(passwordNotes, state => {
        const index = passwordNotes.findIndex(v => v.id === payload.id);
        state[index] = { ...state[index], ...payload, status: 1, mtime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
      });
      return { ...state, passwordNotes };
    },
    addPasswordNote(state, { payload }) {
      const maxID = Math.max(0, ...state.passwordNotes.map(v => v.id));
      const mtime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      return {
        ...state,
        passwordNotes: [{ ...payload, status: 2, mtime, createDate: mtime, id: maxID + 1 }, ...state.passwordNotes],
      };
    },
    deleteNote(
      state,
      {
        payload: { id },
      }
    ) {
      let { notes } = state;
      notes = produce(notes, state => {
        const index = state.findIndex(v => v.id === id);
        state[index] = { ...state[index], status: 3, mtime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
      });
      return { ...state, notes };
    },
    updateNote(state, { payload }) {
      let { notes } = state;
      notes = produce(notes, state => {
        const index = state.findIndex(v => v.id === payload.id);
        state[index] = { ...state[index], ...payload, status: 1, mtime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
      });
      return { ...state, notes };
    },
    addNote(state, { payload }) {
      const maxID = Math.max(0, ...state.notes.map(v => v.id));
      const mtime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      return { ...state, notes: [{ ...payload, status: 2, mtime, createDate: mtime, id: maxID + 1 }, ...state.notes] };
    },
    deleteBook(
      state,
      {
        payload: { id },
      }
    ) {
      let { notes, books } = state;
      const mtime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      books = produce(books, state => {
        const index = state.findIndex(v => v.id === id);
        state[index] = { ...state[index], status: 3, mtime };
      });
      notes = produce(notes, state => {
        state
          .filter(v => v.bookID === id)
          .forEach(v => {
            v.status = 3;
            v.mtime = mtime;
          });
      });
      return { ...state, books, notes };
    },
    updateBook(state, { payload }) {
      let { books } = state;
      books = produce(books, state => {
        const index = books.findIndex(v => v.id === payload.id);
        state[index] = { ...state[index], ...payload, status: 1, mtime: dayjs().format('YYYY-MM-DD HH:mm:ss') };
      });
      return { ...state, books };
    },
    addBook(state, { payload }) {
      const maxID = Math.max(0, ...state.books.map(v => v.id));
      const mtime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      return { ...state, books: [{ ...payload, status: 2, mtime, createDate: mtime, id: maxID + 1 }, ...state.books] };
    },
  },
};
