import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './style';

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
  </View>
);
export default Loading;
