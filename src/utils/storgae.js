import AsyncStorage from '@react-native-community/async-storage';

class DeviceStorage {
  /**
   * 保存
   * @param key
   * @param value
   * @returns {*}
   */
  static set(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify({ data: value }));
  }

  /**
   * 删除
   * @param key
   * @returns {*}
   */
  static remove(key) {
    return AsyncStorage.removeItem(key);
  }

  /**
   * 更新
   * @param key
   * @param value
   * @returns {Promise<T>|Promise.<TResult>}
   */
  static update(key, value) {
    return AsyncStorage.mergeItem(key, JSON.stringify({ data: value }));
  }

  /**
   * 获取
   * @param key
   * @param defaultValue
   * @returns {Promise<T>|*|Promise.<TResult>}
   */
  static get(key, defaultValue = null) {
    return AsyncStorage.getItem(key).then(value => {
      return value ? JSON.parse(value).data : defaultValue;
    });
  }

  /**
   * 批量添加
   * @param keyValuePairs
   * @returns {*}
   */
  static multiSet(keyValuePairs) {
    return AsyncStorage.multiSet(keyValuePairs.map(([k, v]) => [k, JSON.stringify({ data: v })]));
  }

  /**
   * 批量删除
   * @param keys
   * @returns {*}
   */
  static multiRemove(keys) {
    return AsyncStorage.multiRemove(keys);
  }

  /**
   * 批量更新
   * @param keyValuePairs
   * @returns {*}
   */
  static multiUpdate(keyValuePairs) {
    return AsyncStorage.multiMerge(keyValuePairs.map(([k, v]) => [k, JSON.stringify({ data: v })]));
  }

  /**
   * 批量查询
   * @param keys
   * @returns {*}
   */
  static multiGet(keys) {
    return AsyncStorage.multiGet(keys).then(values => {
      return values.map(value => (value ? JSON.parse(value).data : null));
    });
  }

  /**
   * 清空
   * @returns {*}
   */
  static clear() {
    return AsyncStorage.clear();
  }

  /**
   * 获取keys
   * @returns {*}
   */
  static getAllKeys() {
    return AsyncStorage.getAllKeys();
  }

  /**
   * 清除所有进行中的查询操作
   * @returns {*}
   */
  static flushGetRequests() {
    return AsyncStorage.flushGetRequests();
  }
}
export default DeviceStorage;
