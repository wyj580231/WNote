import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { backgroundColor: '#fff', fontSize: 14, padding: 20, borderRadius: 4, letterSpacing: 2 },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingBottom: 8,
  },
  content: {
    paddingVertical: 10,
  },
  footer: {
    fontSize: 16,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
