import React, { memo } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './style';

const MyModal = ({
  themeColor,
  visible,
  onOK,
  onCancel,
  title = null,
  children,
  okText = '确定',
  cancelText = '取消',
  footer = (
    <View style={styles.footer}>
      <Button title={cancelText} onPress={onCancel} type="clear" titleStyle={{ color: '#aaa' }} />
      <Button
        title={okText}
        onPress={onOK}
        type="clear"
        titleStyle={{ color: themeColor }}
        buttonStyle={{ marginLeft: 20 }}
      />
    </View>
  ),
}) => {
  switch (typeof title) {
    case 'undefined':
      title = null;
      break;
    case 'string':
      title = <Text style={styles.title}>{title}</Text>;
      break;
    default:
      break;
  }
  return (
    <Modal
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      isVisible={visible}
      onBackButtonPress={onCancel}
      onBackdropPress={onCancel}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
    >
      <View style={styles.container}>
        {title}
        <View style={styles.content}>{children}</View>
        {footer}
      </View>
    </Modal>
  );
};
const mapStateToProps = ({ app: { themes, activeTheme } }) => ({ themeColor: themes[activeTheme] });
export default connect(mapStateToProps)(memo(MyModal));
