import React, { memo } from 'react';
import { Header } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import menuData from '../../config/menu';
import { name as appName } from '../../../app.json';

const AppHeader = ({
  leftType = 'menu',
  rightType = 'home',
  title,
  navigation: {
    navigate,
    openDrawer,
    goBack,
    state: { routeName },
  },
}) => {
  switch (typeof title) {
    case 'undefined':
      const find = menuData.find(v => v.route === routeName);
      title = find ? find.name : appName;
      break;
    case 'string':
      break;
    default:
      break;
  }
  if (typeof title === 'string') {
    title = { text: title, numberOfLines: 1, ellipsizeMode: 'tail' };
  }
  let leftComponent = null;
  switch (leftType) {
    case 'menu':
      leftComponent = { icon: 'menu', onPress: openDrawer };
      break;
    case 'back':
      leftComponent = {
        icon: 'arrow-back',
        onPress() {
          goBack();
        },
      };
      break;
    default:
      break;
  }
  let rightComponent = null;
  switch (rightType) {
    case 'home':
      rightComponent = {
        icon: 'home',
        onPress() {
          navigate('Home');
        },
      };
      break;
    case 'none':
      break;
    default:
      break;
  }
  return <Header leftComponent={leftComponent} centerComponent={title} rightComponent={rightComponent} />;
};
export default withNavigation(memo(AppHeader));
