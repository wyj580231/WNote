import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  list: { flex: 1, paddingHorizontal: 10 },
  addBtn: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    zIndex: 10,
  },
  item: {
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  date: {
    color: '#bbb',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    color: '#424242',
  },
  content: {
    color: '#999',
    fontSize: 15,
  },
});
