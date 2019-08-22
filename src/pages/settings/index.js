import React, { useState, memo, useEffect } from 'react';
import { ScrollView, View, Text, Switch, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import TouchID from 'react-native-touch-id';
import { connect } from 'react-redux';
import Header from '../../components/header/index';
import Modal from '../../components/base/modal';
import styles from './style';

const Settings = ({ themes, activeTheme, dispatch, useTouchID }) => {
  function handleFingerStateChange(newValue) {
    if (newValue) {
      TouchID.authenticate(null, {
        title: '验证指纹',
        cancelText: '取消',
        imageColor: themeColor,
        sensorDescription: '需要您的指纹,以开启指纹验证',
        sensorErrorDescription: '验证失败!',
        fallbackLabel: '',
      })
        .then(() => {
          Toast.show('指纹设置成功.');
          dispatch({ type: 'app/save', payload: { useTouchID: newValue } });
        })
        .catch(() => {
          Toast.show('指纹未设置成功.');
        });
    } else {
      Alert.alert(null, '确定关闭指纹验证?', [
        { text: '取消' },
        {
          text: '确定',
          onPress() {
            dispatch({ type: 'app/save', payload: { useTouchID: newValue } });
          },
        },
      ]);
    }
  }
  const [authType, setAuthType] = useState(null);
  useEffect(() => {
    TouchID.isSupported()
      .then(biometryType => {
        if (biometryType === 'FaceID') {
          setAuthType('FaceID');
        } else {
          setAuthType('TouchID');
        }
      })
      .catch(() => {
        setAuthType('none');
      });
  }, []);
  const themeColor = themes[activeTheme];
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <ListItem
          title="主题色"
          leftIcon={{ name: 'color-lens' }}
          rightElement={<Text style={[styles.themeBlock, { backgroundColor: themeColor }]} />}
          onPress={() => setThemeModalVisible(true)}
        />
        {authType === 'TouchID' && (
          <ListItem
            title="指纹"
            leftIcon={{ name: 'fingerprint' }}
            rightElement={
              <Switch
                value={useTouchID}
                onValueChange={handleFingerStateChange}
                trackColor={{ true: themeColor + '88' }}
                thumbColor={useTouchID ? themeColor : '#eee'}
              />
            }
          />
        )}
        {authType === 'FaceID' && <ListItem title="面部识别" leftIcon={{ name: 'face' }} />}
      </ScrollView>
      <Modal visible={themeModalVisible} onCancel={() => setThemeModalVisible(false)} footer={null}>
        <View style={styles.themeContainer}>
          {themes.map((v, i) => {
            const checked = activeTheme === i;
            return (
              <ListItem
                containerStyle={styles.themeItem}
                key={v}
                title={v}
                titleStyle={{ color: v }}
                leftIcon={{ name: checked ? 'radio-button-checked' : 'radio-button-unchecked', color: v }}
                rightElement={<Text style={[styles.themeBlock, { backgroundColor: v }]} />}
                onPress={() => {
                  dispatch({ type: 'app/changeTheme', payload: { activeTheme: i } });
                  setThemeModalVisible(false);
                }}
              />
            );
          })}
        </View>
      </Modal>
    </View>
  );
};
const mapStateToProps = ({ app: { themes, activeTheme, useTouchID } }) => ({ themes, activeTheme, useTouchID });
export default connect(mapStateToProps)(memo(Settings));
