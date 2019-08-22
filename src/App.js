/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { lazy, Suspense } from 'react';
import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { Dimensions } from 'react-native';
import DrawerContentComponent from './components/drawerContentComponent';
import DeviceStorage from './utils/storgae';
import Loading from './components/loading';
import authRoute from './components/authRoute';
import authPassword from './components/authPassword';

const LazyAccount = lazy(() => import('./pages/account'));
const Account = props => (
  <Suspense fallback={<Loading />}>
    <LazyAccount {...props} />
  </Suspense>
);

const LazyModifyPassword = lazy(() => import('./pages/account/modifyPassword'));
const ModifyPassword = props => (
  <Suspense fallback={<Loading />}>
    <LazyModifyPassword {...props} />
  </Suspense>
);

const LazyLogin = lazy(() => import('./pages/login'));
const Login = props => (
  <Suspense fallback={<Loading />}>
    <LazyLogin {...props} />
  </Suspense>
);

const LazyRegister = lazy(() => import('./pages/register'));
const Register = props => (
  <Suspense fallback={<Loading />}>
    <LazyRegister {...props} />
  </Suspense>
);

const LazyNotes = lazy(() => import('./pages/notes'));
const Notes = props => (
  <Suspense fallback={<Loading />}>
    <LazyNotes {...props} />
  </Suspense>
);

const LazyNotesByBook = lazy(() => import('./pages/notes/notesByBook'));
const NotesByBook = props => (
  <Suspense fallback={<Loading />}>
    <LazyNotesByBook {...props} />
  </Suspense>
);
const LazyEditNote = lazy(() => import('./pages/notes/edit'));
const EditNote = props => (
  <Suspense fallback={<Loading />}>
    <LazyEditNote {...props} />
  </Suspense>
);

const LazyPasswordNotes = lazy(() => import('./pages/passwordNotes'));
const PasswordNotes = props => (
  <Suspense fallback={<Loading />}>
    <LazyPasswordNotes {...props} />
  </Suspense>
);
const LazyEditPasswordNote = lazy(() => import('./pages/passwordNotes/edit'));
const EditPasswordNote = props => (
  <Suspense fallback={<Loading />}>
    <LazyEditPasswordNote {...props} />
  </Suspense>
);

const LazyBooks = lazy(() => import('./pages/books'));
const Books = props => (
  <Suspense fallback={<Loading />}>
    <LazyBooks {...props} />
  </Suspense>
);

const LazySettings = lazy(() => import('./pages/settings'));
const Settings = props => (
  <Suspense fallback={<Loading />}>
    <LazySettings {...props} />
  </Suspense>
);
const WINDOW_WIDTH = Dimensions.get('window').width;
const drawerWidth = Math.min(WINDOW_WIDTH * 0.8, 300);
const Drawer = createDrawerNavigator(
  {
    Home: Notes,
    Books,
    PasswordNotes,
    Settings,
    Account: authRoute(Account),
  },
  {
    initialRouteName: 'Home',
    drawerWidth,
    contentComponent: DrawerContentComponent,
  }
);
const NavStack = createStackNavigator(
  { Drawer, Login, Register, EditNote, ModifyPassword, EditPasswordNote, NotesByBook },
  { initialRouteName: 'Drawer', headerMode: 'none' }
);
const AppContainer = createAppContainer(NavStack);

const persistenceKey = 'persistenceKey';
const persistNavigationState = async navState => {
  await DeviceStorage.set(persistenceKey, navState);
};
const loadNavigationState = async () => {
  const navState = await DeviceStorage.get(persistenceKey);
  return navState;
};
function getPersistenceFunctions(isStore) {
  return isStore
    ? {
        persistNavigationState,
        loadNavigationState,
      }
    : undefined;
}
const App = () => {
  return <AppContainer {...getPersistenceFunctions(__DEV__)} />;
};

export default authPassword(App);
