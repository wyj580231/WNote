import React, { memo, useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { createSelector } from 'reselect';
import Header from '../../components/header/index';
import styles from './style';

const PasswordNote = ({ themeColor, navigation, passwordNotes, dispatch }) => {
  function renderItem({ item: { createDate, name, userName, id } }) {
    return (
      <Menu>
        <MenuTrigger triggerOnLongPress onAlternativeAction={() => navigation.push('EditPasswordNote', { id })}>
          <View style={styles.item}>
            <Text style={styles.date}>{createDate}</Text>
            <Text style={styles.title}>{name}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.content}>
              {userName}
            </Text>
          </View>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption>
            <ListItem
              title="删除"
              leftIcon={{ name: 'delete' }}
              onPress={() =>
                Alert.alert(`确定删除${name}?`, '', [
                  { text: '取消' },
                  {
                    text: '确定',
                    onPress() {
                      dispatch({ type: 'note/deletePasswordNote', payload: { id } });
                    },
                  },
                ])
              }
            />
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }
  async function handleSync() {
    if (loading) return;
    setLoading(true);
    await dispatch({
      type: 'note/syncAllData',
    });
    setLoading(false);
  }
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Header />
      <Icon
        name="add-circle"
        color={themeColor}
        size={50}
        containerStyle={styles.addBtn}
        onPress={() => navigation.push('EditPasswordNote', { id: 0 })}
      />
      <FlatList
        onRefresh={handleSync}
        refreshing={loading}
        ListEmptyComponent={
          <ListItem
            title="还没有记录, 新建一条"
            rightIcon={{ name: 'add' }}
            onPress={() => navigation.push('EditPasswordNote', { id: 0 })}
          />
        }
        style={styles.list}
        data={passwordNotes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};
const getPasswordNotes = createSelector(
  passwordNotes => passwordNotes,
  passwordNotes => passwordNotes.filter(v => v.status !== 3)
);
const mapStateToProps = ({ app: { themes, activeTheme }, note: { passwordNotes } }) => ({
  themeColor: themes[activeTheme],
  passwordNotes: getPasswordNotes(passwordNotes),
});
export default connect(mapStateToProps)(memo(PasswordNote));
