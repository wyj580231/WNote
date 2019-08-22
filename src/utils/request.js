import { Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import DeviceStorage from './storgae';

function parseJSON(response) {
  return response.json();
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw { response };
}

async function request(
  url,
  { method = 'get', isStringify = true, isAutoAlert = true, body, ContentType, isProcessBody = true } = {}
) {
  const Authorization = await DeviceStorage.get('authorization');
  if (url.startsWith('/api')) {
    //url = 'http://192.168.3.7:11773' + url;
    url = 'http://47.100.2.128:5010' + url;
  }
  if (isProcessBody) {
    if (method === 'get') {
      if (body) {
        url += url.includes('?') ? '&' : '?';
        for (let key in body) {
          let typeStr = Object.prototype.toString.call(body[key]);
          if (typeStr === '[object Array]') {
            for (let value of body[key]) {
              url += `${key}=${value}&`;
            }
          } else if (typeStr === '[object String]' || typeStr === '[object Number]') {
            url += `${key}=${body[key]}&`;
          }
        }
        url = url.substring(0, url.length - 1);
      }
      body = undefined;
    } else if (body) {
      if (isStringify) {
        body = JSON.stringify(body);
      } else {
        let params = new URLSearchParams();
        for (let key in body) {
          let typeStr = Object.prototype.toString.call(body[key]);
          if (typeStr === '[object Array]') {
            for (let value of body[key]) {
              params.append(key, value);
            }
          } else {
            params.set(key, body[key]);
          }
        }
        body = params;
      }
    }
  }
  return fetch(url, {
    mode: 'cors',
    method,
    headers: {
      'Content-Type':
        ContentType ||
        (isStringify ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8'),
      Accept: 'application/json',
      Authorization,
    },
    body,
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(res => {
      if (isAutoAlert && res.result !== 'OK') {
        Alert.alert('系统提示:', res.message, [{ text: '确定' }]);
      }
      return res;
    })
    .catch(err => {
      if (err.message === 'Network request failed') {
        Toast.show('网络离线,请联网后重试.', { duration: Toast.durations.LONG });
      } else if (err.response && err.response.status) {
        switch (err.response.status) {
          case 401:
            break;
          case 404:
            break;
          case 500:
            break;
          default:
            break;
        }
        if (isAutoAlert) {
          Alert.alert('系统提示:', `请求错误,url: ${url}. 状态码: ${err.response.status}`, [{ text: '确定' }]);
        }
      }
    });
}
['get', 'post', 'put', 'delete'].forEach(v => (request[v] = (url, options) => request(url, { method: v, ...options })));
export default request;
