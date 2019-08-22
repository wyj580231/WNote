import React, { memo, useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { createSelector } from 'reselect';
import Header from '../../components/header/index';
import styles from './style';

const Home = ({ themeColor, navigation, notes, dispatch }) => {
  function renderItem({ item: { createDate, title, content, id } }) {
    return (
      <Menu>
        <MenuTrigger triggerOnLongPress onAlternativeAction={() => navigation.push('EditNote', { id })}>
          <View style={styles.item}>
            <Text style={styles.date}>{createDate}</Text>
            <Text style={styles.title}>{title || '无标题笔记'}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.content}>
              {content}
            </Text>
          </View>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption>
            <ListItem
              title="删除"
              leftIcon={{ name: 'delete' }}
              onPress={() =>
                Alert.alert(`确定删除${title}?`, '', [
                  { text: '取消' },
                  {
                    text: '确定',
                    onPress() {
                      dispatch({ type: 'note/deleteNote', payload: { id } });
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
      <Header rightType="none" />
      <Icon
        name="add-circle"
        color={themeColor}
        size={50}
        containerStyle={styles.addBtn}
        onPress={() => navigation.push('EditNote', { id: 0 })}
      />
      <FlatList
        onRefresh={handleSync}
        refreshing={loading}
        ListEmptyComponent={
          <ListItem
            title="还没有笔记, 新建一条"
            rightIcon={{ name: 'add' }}
            onPress={() => navigation.push('EditNote', { id: 0, defaultBookID: 0 })}
          />
        }
        style={styles.list}
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};
const getNotes = createSelector(
  notes => notes,
  notes => notes.filter(v => v.status !== 3)
);
const mapStateToProps = ({ app: { themes, activeTheme }, note: { notes } }) => ({
  themeColor: themes[activeTheme],
  notes: getNotes(notes),
});
export default connect(mapStateToProps)(memo(Home));
