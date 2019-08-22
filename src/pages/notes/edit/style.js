import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  top: {
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIcon: {
    marginRight: 30,
  },
  topIconDisabled: {
    backgroundColor: 'transparent',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  bookBtnContainer: { flex: 1 },
  bookBtn: { justifyContent: 'flex-start', paddingHorizontal: 0 },
  bookTitle: { flex: 1, textAlign: 'left' },
  content: {
    padding: 8,
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
  },
  modalContainer: { flex: 1, margin: 0, alignItems: 'flex-end' },
  infoContainer: {
    flex: 1,
    width: '80%',
    backgroundColor: '#fff',
  },
});
