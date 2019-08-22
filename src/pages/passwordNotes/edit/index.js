import React, { useState, useRef, memo, useEffect } from 'react';
import { View, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import { createSelector } from 'reselect';
import { Input, Icon } from 'react-native-elements';
import styles from './style';

const EditPasswordNote = ({ navigation, themeColor, dispatch, passwordNotes }) => {
  function setFieldValue(field, value) {
    setPasswordNote({ ...passwordNote, [field]: value });
  }
  function setErrorValue(field, value) {
    setError({ ...error, [field]: value });
  }
  function validateField(field) {
    const value = passwordNote[field];
    switch (field) {
      case 'name':
        setErrorValue('name', value ? null : '请输入名称');
        if (!value) {
          refName.current.shake();
        }
        return !!passwordNote.name;
      case 'userName':
        setErrorValue('userName', value ? null : '请输入账号');
        if (!value) {
          refUserName.current.shake();
        }
        return !!value;
      case 'password':
        setErrorValue('password', value ? null : '请输入密码');
        if (!value) {
          refPassword.current.shake();
        }
        return !!value;
      default:
        return false;
    }
  }
  function handleDone() {
    if (['name', 'password'].every(validateField)) {
      if (passwordNoteID > 0) {
        dispatch({
          type: 'note/updatePasswordNote',
          payload: passwordNote,
        });
      } else {
        dispatch({
          type: 'note/addPasswordNote',
          payload: passwordNote,
        });
      }
      navigation.goBack();
    }
  }
  async function handleClip(field) {
    await Clipboard.setString(passwordNote[field]);
    Toast.show('复制成功.');
  }
  const refName = useRef(null);
  const refUserName = useRef(null);
  const refPassword = useRef(null);
  const [passwordNote, setPasswordNote] = useState({ name: '', userName: '', password: '' });
  const [error, setError] = useState({ name: null, userName: null, password: null });
  const passwordNoteID = navigation.getParam('id');
  useEffect(() => {
    if (passwordNoteID > 0) {
      const find = passwordNotes.find(v => v.id === passwordNoteID);
      setPasswordNote(find);
    }
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Icon name="arrow-back" onPress={() => navigation.goBack()} containerStyle={styles.topIcon} />
        <Icon name="done" onPress={handleDone} color={themeColor} containerStyle={styles.topIcon} />
      </View>
      <Input
        inputContainerStyle={styles.inputContainerStyle}
        ref={refName}
        placeholder="名称"
        value={passwordNote.name}
        errorMessage={error.name}
        onSubmitEditing={() => refUserName.current.focus()}
        onChangeText={text => setFieldValue('name', text)}
      />
      <Input
        rightIcon={{
          name: 'content-copy',
          onPress() {
            handleClip('userName');
          },
        }}
        inputContainerStyle={styles.inputContainerStyle}
        ref={refUserName}
        placeholder="账号"
        value={passwordNote.userName}
        errorMessage={error.userName}
        onSubmitEditing={() => refPassword.current.focus()}
        onChangeText={text => setFieldValue('userName', text)}
      />
      <Input
        rightIcon={{
          name: 'content-copy',
          onPress() {
            handleClip('password');
          },
        }}
        keyboardType="visible-password"
        inputContainerStyle={styles.inputContainerStyle}
        ref={refPassword}
        placeholder="密码"
        value={passwordNote.password}
        errorMessage={error.password}
        onSubmitEditing={handleDone}
        onChangeText={text => setFieldValue('password', text)}
      />
    </View>
  );
};
const getPasswordNote = createSelector(
  passwordNotes => passwordNotes,
  passwordNotes => passwordNotes.filter(v => v.status !== 3)
);
const mapStateToProps = ({ app: { themes, activeTheme }, note: { passwordNotes } }) => ({
  themeColor: themes[activeTheme],
  passwordNotes: getPasswordNote(passwordNotes),
});
export default connect(mapStateToProps)(memo(EditPasswordNote));
