import React, { useState, useEffect, memo } from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { Icon, Input, Button, ListItem } from 'react-native-elements';
import produce from 'immer';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import ActionSheet from '../../../components/base/actionSheet';
import AddBook from '../../../components/addBook';
import { getBooks } from '../../books';
import styles from './style';

const EditNote = ({ themeColor, navigation, notes, books, dispatch }) => {
  function handleDone() {
    if (!content) return Toast.show('内容不能为空!');
    if (noteID > 0) {
      dispatch({
        type: 'note/updateNote',
        payload: {
          ...note,
          content,
        },
      });
    } else {
      dispatch({
        type: 'note/addNote',
        payload: {
          bookID: note.bookID,
          title: note.title,
          content,
        },
      });
    }
    navigation.goBack();
  }
  function handleContentChange(text) {
    const isWillOutOfCacheCount = contents.length === maxHistoryCount;
    setContents(
      produce(state => {
        state = state.slice(isWillOutOfCacheCount ? 1 : 0, activeIndex + 1);
        state.push(text);
        return state;
      })
    );
    setActiveIndex(isWillOutOfCacheCount ? activeIndex : activeIndex + 1);
  }
  function handleSelectBook(item) {
    setNote(
      produce(state => {
        state.bookID = item.id;
      })
    );
    setTitleActionSheetVisible(false);
  }
  const noteID = navigation.getParam('id');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [note, setNote] = useState({ id: 0, bookID: 0, title: '' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [contents, setContents] = useState(['']);
  const [titleActionSheetVisible, setTitleActionSheetVisible] = useState(false);
  useEffect(() => {
    if (noteID > 0) {
      const find = notes.find(v => v.id === noteID);
      setNote({ ...find });
      setContents([find.content]);
    } else {
      const defaultBookID = navigation.getParam('defaultBookID', 0);
      setNote({ ...note, bookID: defaultBookID });
    }
  }, []);
  const btnColor = '#727272';
  const btnColorDisabled = '#ccc';
  const maxHistoryCount = 5; //最多回退数量
  const content = contents[activeIndex];
  const prevDisabled = activeIndex === 0;
  const nextDisabled = activeIndex === contents.length - 1;
  const prevBtnColor = prevDisabled ? btnColorDisabled : btnColor;
  const nextBtnColor = nextDisabled ? btnColorDisabled : btnColor;
  const book = books.find(v => v.id === note.bookID);
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Icon name="arrow-back" onPress={() => navigation.goBack()} containerStyle={styles.topIcon} />
        <Icon name="done" onPress={handleDone} color={themeColor} containerStyle={styles.topIcon} />
        <Icon
          name="ccw"
          type="entypo"
          size={20}
          containerStyle={styles.topIcon}
          color={prevBtnColor}
          disabled={prevDisabled}
          disabledStyle={styles.topIconDisabled}
          onPress={() => {
            setActiveIndex(activeIndex - 1);
          }}
        />
        <Icon
          name="cw"
          type="entypo"
          size={20}
          containerStyle={styles.topIcon}
          disabled={nextDisabled}
          color={nextBtnColor}
          disabledStyle={styles.topIconDisabled}
          onPress={() => {
            setActiveIndex(activeIndex + 1);
          }}
        />
      </View>
      <Input
        placeholder="标题"
        value={note.title}
        onChangeText={text =>
          setNote(
            produce(state => {
              state.title = text;
            })
          )
        }
        inputContainerStyle={{ borderBottomWidth: 0 }}
      />
      <View style={styles.info}>
        <Button
          icon={{ name: 'book', color: btnColor }}
          title={book.name}
          type="clear"
          containerStyle={styles.bookBtnContainer}
          buttonStyle={styles.bookBtn}
          titleStyle={[styles.bookTitle, { color: btnColor }]}
          titleProps={{ numberOfLines: 1, ellipsizeMode: 'tail' }}
          onPress={() => setTitleActionSheetVisible(true)}
        />
        <Icon
          name="information"
          type="material-community"
          color={btnColor}
          onPress={() => setInfoModalVisible(true)}
          containerStyle={{ width: 50 }}
        />
      </View>
      <TextInput
        multiline
        placeholder="输入内容"
        style={styles.content}
        value={content}
        onChangeText={handleContentChange}
      />
      <ActionSheet
        onItemPress={handleSelectBook}
        data={books}
        keyExtractor="id"
        visible={titleActionSheetVisible}
        title={
          <AddBook
            Element={ListItem}
            elementProps={{
              title: '选择笔记本',
              rightIcon: { name: 'add' },
              titleStyle: { color: '#888' },
            }}
          />
        }
        onCancel={() => setTitleActionSheetVisible(false)}
      />
      <Modal
        isVisible={infoModalVisible}
        style={styles.modalContainer}
        animationIn="fadeInRight"
        animationOut="fadeOutRight"
        onBackButtonPress={() => setInfoModalVisible(false)}
        onBackdropPress={() => setInfoModalVisible(false)}
      >
        <ScrollView style={styles.infoContainer}>
          <ListItem title="标题" subtitle={note.title} />
          <ListItem title="创建时间" subtitle={note.createDate} />
          <ListItem title="修改时间" subtitle={note.mtime} />
          <ListItem title="字数" subtitle={content.length.toString()} />
        </ScrollView>
      </Modal>
    </View>
  );
};
const mapStateToProps = ({ app: { themes, activeTheme }, note: { notes, books } }) => ({
  themeColor: themes[activeTheme],
  notes,
  books: getBooks(books),
});
export default connect(mapStateToProps)(memo(EditNote));
