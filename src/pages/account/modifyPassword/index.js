import React, { useState, useRef, memo } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import Header from '../../../components/header/index';
import styles from './style';

const Register = ({ themeColor, dispatchModifyPassword, navigation, user }) => {
  function validateField(field) {
    switch (field) {
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
    if (['password', 'password1'].every(validateField)) {
      setLoading(true);
      await dispatchModifyPassword(password, () =>
        Toast.show('修改成功.', {
          onHidden() {
            navigation.goBack();
          },
        })
      );
      setLoading(false);
    }
  }
  const refPassword = useRef(null);
  const refPassword1 = useRef(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(null);
  const [password1, setPassword1] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [password1Error, setPassword1Error] = useState(null);
  return (
    <View style={styles.container}>
      <Header leftType="back" />
      <Text style={styles.userName}>{user.userName}</Text>
      <Input
        ref={refPassword}
        placeholder="新密码"
        secureTextEntry
        value={password}
        errorMessage={passwordError}
        onSubmitEditing={() => refPassword1.current.focus()}
        onChangeText={setPassword}
      />
      <Input
        ref={refPassword1}
        placeholder="确认新密码"
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
const mapStateToProps = ({ app: { themes, activeTheme, user } }) => ({ themeColor: themes[activeTheme], user });
const mapDispatchToProps = dispatch => ({
  dispatchModifyPassword(password, callback) {
    return dispatch({
      type: 'app/modifyPassword',
      payload: {
        password,
        callback,
      },
    });
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(Register));
