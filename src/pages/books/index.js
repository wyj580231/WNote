import React, { memo, useState, useRef } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Header from '../../components/header/index';
import Modal from '../../components/base/modal';
import AddBook from '../../components/addBook';
import styles from './style';

const Books = ({ themeColor, navigation, notes, books, dispatch }) => {
  function renderItem({ item }) {
    const { name, id } = item;
    const notesByBook = notes.filter(v => v.status !== 3 && v.bookID === id);
    return (
      <ListItem
        title={name}
        subtitle={`${notesByBook.length}条笔记`}
        onPress={() => navigation.push('NotesByBook', { bookID: id })}
        containerStyle={styles.item}
        rightIcon={
          id > 0
            ? {
                name: 'more-vert',
                onPress() {
                  instance.current.book = item;
                  setMenuModalVisible(true);
                },
              }
            : undefined
        }
      />
    );
  }
  function handleDelete() {
    setMenuModalVisible(false);
    const { book } = instance.current;
    Alert.alert(`删除${book.name}`, `其中的笔记将一同删除, 确定删除这个笔记本?`, [
      { text: '取消' },
      {
        text: '确定',
        onPress() {
          dispatch({
            type: 'note/deleteBook',
            payload: {
              id: book.id,
            },
          });
        },
      },
    ]);
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
  const instance = useRef({});
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header />
      <AddBook
        Element={Icon}
        elementProps={{
          name: 'add-circle',
          color: themeColor,
          size: 50,
          containerStyle: styles.addBtn,
        }}
      />
      <FlatList
        onRefresh={handleSync}
        refreshing={loading}
        style={styles.list}
        data={books.filter(v => v.status !== 3)}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      <Modal visible={menuModalVisible} footer={null} title="笔记本选项" onCancel={() => setMenuModalVisible(false)}>
        <AddBook
          onChange={() => setMenuModalVisible(false)}
          type="update"
          defaultValue={instance.current.book}
          Element={ListItem}
          elementProps={{
            title: '重命名',
          }}
        />
        <ListItem title="删除" onPress={handleDelete} />
      </Modal>
    </View>
  );
};
const getBooks = createSelector(
  books => books,
  books => [{ id: 0, name: '默认笔记本' }, ...books.filter(v => v.status !== 3)]
);
const mapStateToProps = ({ app: { themes, activeTheme }, note: { notes, books } }) => ({
  themeColor: themes[activeTheme],
  notes,
  books: getBooks(books),
});
export { getBooks };
export default connect(mapStateToProps)(memo(Books));
