import React, { useState, useRef, memo } from 'react';
import { View, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Header from '../../components/header/index';
import styles from './style';

const Register = ({ themeColor, dispatch, navigation }) => {
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
      case 'password1':
        setPassword1Error(password === password1 ? null : '两次密码不一致');
        if (password !== password1) {
          refPassword1.current.shake();
        }
        return password === password1;
      default:
        return true;
    }
  }
  async function handleSubmit() {
    if (loading) return;
    if (['userName', 'password', 'password1'].every(validateField)) {
      setLoading(true);
      const err = await dispatch({ type: 'app/auth', payload: { userName, password, type: 'register' } });
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
              navigation.navigate('Home');
            },
          },
        });
      }
    }
  }
  const refUserName = useRef(null);
  const refPassword = useRef(null);
  const refPassword1 = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [password1, setPassword1] = useState(null);
  const [userNameError, setUserNameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [password1Error, setPassword1Error] = useState(null);
  return (
    <View style={styles.container}>
      <Header leftType="back" />
      <Input
        ref={refUserName}
        placeholder="账号"
        value={userName}
        errorMessage={userNameError}
        onSubmitEditing={() => refPassword.current.focus()}
        onChangeText={setUsername}
      />
      <Input
        ref={refPassword}
        placeholder="密码"
        secureTextEntry
        value={password}
        errorMessage={passwordError}
        onSubmitEditing={() => refPassword1.current.focus()}
        onChangeText={setPassword}
      />
      <Input
        ref={refPassword1}
        placeholder="确认密码"
        secureTextEntry
        value={password1}
        errorMessage={password1Error}
        onSubmitEditing={handleSubmit}
        onChangeText={setPassword1}
      />
      <Button
        title="提交"
        activeOpacity={0.7}
        onPress={handleSubmit}
        loading={loading}
        buttonStyle={[styles.submit, { backgroundColor: themeColor }]}
      />
    </View>
  );
};
const mapStateToProps = ({ app: { themes, activeTheme } }) => ({ themeColor: themes[activeTheme] });
export default connect(mapStateToProps)(memo(Register));
