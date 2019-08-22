import React, { memo, useState } from 'react';
import { View, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import styles from './style';
import menuData from '../../config/menu';

const DrawerContentComponent = ({
  navigation,
  activeItemKey,
  themeColor,
  user,
  dispatchUploadAvatar,
  dispatchSync,
}) => {
  function handleClickUser() {
    if (isLogin) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Login');
    }
  }
  async function handleClickAvatar(type) {
    await ImagePicker.clean();
    const image = await ImagePicker[type]({
      showCropGuidelines: false,
      mediaType: 'photo',
      cropperCircleOverlay: true,
      width: 200,
      height: 200,
      cropping: true,
    });
    await dispatchUploadAvatar(image.path);
  }
  async function handleClickSync() {
    if (loading) return;
    setLoading(true);
    await dispatchSync();
    setLoading(false);
  }
  const isLogin = !!user;
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Menu>
          <MenuTrigger disabled={!isLogin}>
            <Avatar
              size="medium"
              rounded
              showEditButton
              activeOpacity={0.7}
              containerStyle={styles.avatar}
              source={isLogin && user.avatar ? { uri: user.avatar } : undefined}
            />
          </MenuTrigger>
          <MenuOptions customStyles={{ optionsContainer: { marginTop: 60, width: 150 } }}>
            {[
              { text: '相机', type: 'openCamera', icon: 'camera' },
              { text: '相册', type: 'openPicker', icon: 'image' },
            ].map(v => (
              <MenuOption key={v.type} onSelect={() => handleClickAvatar(v.type)}>
                <ListItem title={v.text} leftIcon={{ name: v.icon, type: 'entypo' }} />
              </MenuOption>
            ))}
          </MenuOptions>
        </Menu>
        <ListItem
          title={isLogin ? user.userName : '用户登录'}
          titleStyle={styles.title}
          onPress={handleClickUser}
          rightIcon={<Icon name="arrow-drop-down" />}
        />
      </View>
      <ScrollView>
        {menuData
          .filter(v => v.inDrawer)
          .map(item => {
            const isActive = activeItemKey === item.route;
            return (
              <ListItem
                title={item.name}
                titleStyle={{ color: isActive ? themeColor : '#424242' }}
                leftIcon={{ name: item.icon, color: isActive ? themeColor : '#424242' }}
                key={item.name}
                onPress={() => {
                  navigation.navigate(item.route);
                  navigation.closeDrawer();
                }}
              />
            );
          })}
      </ScrollView>
      <ListItem
        title={loading ? '同步中...' : '开始同步'}
        onPress={handleClickSync}
        leftIcon={loading ? <ActivityIndicator /> : <Icon name="sync" />}
      />
    </SafeAreaView>
  );
};
const mapStateToProps = ({ app: { themes, activeTheme, user } }) => ({ themeColor: themes[activeTheme], user });
const mapDispatchToProps = dispatch => ({
  dispatchUploadAvatar(path) {
    return dispatch({ type: 'app/uploadAvatar', payload: { path } });
  },
  dispatchSync() {
    return dispatch({
      type: 'note/syncAllData',
    });
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(DrawerContentComponent));
