import React, { useState, useRef, Fragment } from 'react';
import { Input } from 'react-native-elements';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import Modal from '../base/modal';

const AddBook = ({ books, dispatch, Element, elementProps, type = 'add', defaultValue, onChange }) => {
  const isUpdate = type === 'update';
  function handleAddBook() {
    if (text) {
      if (text === '默认笔记本' || books.some(v => v.name === text)) {
        return Alert.alert(null, '名称重复!', [{ text: '确定' }]);
      }
      if (isUpdate) {
        dispatch({ type: 'note/updateBook', payload: { name: text, id: defaultValue.id } });
      } else {
        dispatch({ type: 'note/addBook', payload: { name: text } });
      }
      onChange && onChange();
      setVisible(false);
    } else {
      addTitleInputRef.current.shake();
    }
  }
  const addTitleInputRef = useRef();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState(isUpdate ? defaultValue.name : '');
  const props = {
    ...elementProps,
    onPress() {
      elementProps.onPress && elementProps.onPress();
      setVisible(true);
    },
  };
  return (
    <Fragment>
      <Element {...props} />
      <Modal
        visible={visible}
        title={isUpdate ? null : '添加笔记本'}
        onCancel={() => setVisible(false)}
        onOK={handleAddBook}
      >
        <Input placeholder="笔记本名称" ref={addTitleInputRef} value={text} onChangeText={setText} autoFocus />
      </Modal>
    </Fragment>
  );
};
export default connect(({ note: { books } }) => ({
  books,
}))(AddBook);
