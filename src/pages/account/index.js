import React, { memo } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import Header from '../../components/header/index';

const Account = ({ dispatch, navigation }) => {
  function handleClickLogout() {
    Alert.alert('退出登录', `退出登录后,所有笔记缓存将从设备移除,确定退出吗?`, [
      { text: '取消' },
      {
        text: '确定',
        onPress() {
          dispatch({ type: 'app/logout' });
          navigation.navigate('Login');
        },
      },
    ]);
  }

  return (
    <View>
      <Header />
      <ScrollView>
        <ListItem
          title="修改密码"
          rightIcon={{ name: 'chevron-right' }}
          onPress={() => navigation.push('ModifyPassword')}
        />
        <ListItem title="退出登录" rightIcon={{ name: 'chevron-right' }} onPress={handleClickLogout} />
      </ScrollView>
    </View>
  );
};
const mapStateToProps = ({ app: { user } }) => ({ user });
export default connect(mapStateToProps)(memo(Account));
