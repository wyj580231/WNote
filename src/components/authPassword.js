import React, { Fragment, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TouchID from 'react-native-touch-id';
import { Button, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';

export default WrappedComponent => {
  const HOC = props => {
    const { useTouchID, themeColor, user } = props;
    const isLogin = !!user;
    const [isAuthed, setIsAuthed] = useState(!useTouchID);
    function authTouchID() {
      TouchID.authenticate(null, {
        title: '验证指纹',
        cancelText: '取消',
        imageColor: themeColor,
        sensorDescription: '验证指纹进入应用',
        sensorErrorDescription: '验证失败!',
        fallbackLabel: '',
      }).then(() => {
        setIsAuthed(true);
      });
    }
    useEffect(() => {
      if (useTouchID) {
        authTouchID();
      }
    }, []);
    return (
      <Fragment>
        <WrappedComponent {...props} />
        {useTouchID && !isAuthed && (
          <View style={styles.container}>
            {isLogin && (
              <Avatar
                size="large"
                rounded
                source={user.avatar ? { uri: user.avatar } : undefined}
                containerStyle={styles.avatar}
              />
            )}
            {isLogin && <Text style={styles.userName}>{user.userName}</Text>}
            <Button
              title="点击唤醒指纹解锁"
              icon={{ name: 'fingerprint', color: themeColor, size: 36 }}
              titleStyle={styles.btnText}
              onPress={authTouchID}
              type="clear"
            />
          </View>
        )}
      </Fragment>
    );
  };
  HOC.displayName = `HOCPasswordAuth${WrappedComponent.displayName || WrappedComponent.name || 'Component'}`;
  return connect(({ app: { themes, activeTheme, useTouchID, user } }) => ({
    useTouchID,
    themeColor: themes[activeTheme],
    user,
  }))(HOC);
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  avatar: {
    marginVertical: 10,
  },
  userName: {
    marginVertical: 10,
    color: '#aaa',
  },
  btnText: {
    color: '#727272',
  },
});
