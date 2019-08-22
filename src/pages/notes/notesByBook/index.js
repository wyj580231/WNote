import React, { memo } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { createSelector } from 'reselect';
import Header from '../../../components/header/index';
import { getBooks } from '../../books';
import styles from './style';

const NotesByBook = ({ themeColor, navigation, notes, book, dispatch }) => {
  console.log(notes);
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

  return (
    <View style={styles.container}>
      <Header title={book.name} leftType="back" />
      <Icon
        name="add-circle"
        color={themeColor}
        size={50}
        containerStyle={styles.addBtn}
        onPress={() => navigation.push('EditNote', { id: 0, defaultBookID: book.id })}
      />
      <FlatList
        style={styles.list}
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <ListItem
            title="还没有笔记, 新建一条"
            rightIcon={{ name: 'add' }}
            onPress={() => navigation.push('EditNote', { id: 0, defaultBookID: book.id })}
          />
        }
      />
    </View>
  );
};
const getBook = createSelector(
  ({ books }, { bookID }) => ({ books, bookID }),
  ({ books, bookID }) => books.find(v => v.id === bookID)
);
const getNotes = createSelector(
  ({ notes }, { bookID }) => ({ notes, bookID }),
  ({ notes, bookID }) => notes.filter(v => v.status !== 3 && v.bookID === bookID)
);
const mapStateToProps = ({ app: { themes, activeTheme }, note: { notes, books } }, { navigation }) => {
  const bookID = navigation.getParam('bookID');
  books = getBooks(books);
  return {
    themeColor: themes[activeTheme],
    notes: getNotes({ notes }, { bookID }),
    book: getBook({ books }, { bookID }),
  };
};
export default connect(mapStateToProps)(memo(NotesByBook));
