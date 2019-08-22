import React, { useState, useRef, memo } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Input, Button, Icon } from 'react-native-elements';
import Header from '../../components/header/index';
import styles from './style';

const Login = ({ navigation, themeColor, dispatch, noRedirect }) => {
  function validateField(field) {
    switch (field) {
      case 'userName':
        setUserNameError(userName ? null : '请输入用户名');
        if (!userName) {
          refUserName.current.shake();
        }
        return !!userName;
      case 'password':
        setPasswordError(password ? null : '请输入密码');
        if (!password) {
          refPassword.current.shake();
        }
        return !!password;
      default:
        return true;
    }
  }
  async function handleSubmit() {
    if (loading) return;
    if (['userName', 'password'].every(validateField)) {
      setLoading(true);
      const err = await dispatch({ type: 'app/auth', payload: { userName, password, type: 'login' } });
      setLoading(false);
      if (err) {
        if (err.message) {
          const { message } = err;
          if (message.includes('密码')) {
            setPasswordError(message);
            refPassword.current.shake();
          } else if (message.includes('账号')) {
            setUserNameError(message);
            refUserName.current.shake();
          } else {
            Alert.alert('系统提示', message, [{ text: '确定' }]);
          }
        }
      } else {
        await dispatch({
          type: 'note/syncAllData',
          payload: {
            callback() {
              if (!noRedirect) navigation.navigate('Home');
            },
          },
        });
      }
    }
  }
  const refUserName = useRef(null);
  const refPassword = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [userNameError, setUserNameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  return (
    <View style={styles.container}>
      <Header leftType="back" title="登录" />
      <Input
        ref={refUserName}
        placeholder="账号"
        value={userName}
        errorMessage={userNameError}
        onSubmitEditing={() => refPassword.current.focus()}
        onChangeText={setUserName}
      />
      <Input
        ref={refPassword}
        placeholder="密码"
        secureTextEntry
        value={password}
        errorMessage={passwordError}
        onSubmitEditing={handleSubmit}
        onChangeText={setPassword}
      />
      <Button
        title="登录"
        activeOpacity={0.7}
        onPress={handleSubmit}
        loading={loading}
        buttonStyle={[styles.submit, { backgroundColor: themeColor }]}
      />
      <Button
        disabled={loading}
        title="注册"
        buttonStyle={styles.registerContainer}
        titleStyle={styles.registerTitle}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Register')}
        icon={<Icon name="arrow-forward" color="#424242" size={20} />}
        iconRight
      />
    </View>
  );
};
const mapStateToProps = ({ app: { themes, activeTheme } }) => ({ themeColor: themes[activeTheme] });
export default connect(mapStateToProps)(memo(Login));
