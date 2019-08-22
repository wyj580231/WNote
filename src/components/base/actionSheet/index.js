import React, { memo } from 'react';
import Modal from 'react-native-modal';
import { ListItem } from 'react-native-elements';
import { View, Text, FlatList } from 'react-native';
import styles from './style';

const ActionSheet = ({ visible, title, onCancel, data, renderItem, onItemPress, keyExtractor = item => item }) => {
  let Title = null;
  switch (typeof title) {
    case 'string':
      Title = <Text style={styles.title}>{title}</Text>;
      break;
    case 'undefined':
      break;
    default:
      Title = title;
      break;
  }
  if (typeof keyExtractor === 'string') {
    const key = keyExtractor;
    keyExtractor = item => item[key].toString();
  }
  renderItem =
    renderItem ||
    (({ item, index }) => (
      <ListItem
        title={item.name || item}
        titleProps={{ numberOfLines: 1, ellipsizeMode: 'tail' }}
        onPress={() => onItemPress(item, index)}
      />
    ));
  return (
    <Modal isVisible={visible} style={styles.container} onBackButtonPress={onCancel} onBackdropPress={onCancel}>
      <View style={styles.inner}>
        {Title}
        <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
      </View>
    </Modal>
  );
};
export default memo(ActionSheet);
