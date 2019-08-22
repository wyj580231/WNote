# WNote
react-native客户端  
```
yarn 
yarn dev
yarn build
```
```
npm install 
npm run dev
npm run build
```
　　
  一直从事web端开发,主要使用react技术栈.手握react这个跨平台开发利器,却一直没开发过react-native项目.之前写过一个公众号项目,但总感觉性能不太好,没有原生app操作的那种反馈感.这段时间比较空闲, 抽空学习了下react-native教程,花了三周多下班时间,开发了这个项目 ,使用的最新的react-native版本0.60.4, 配色和主要功能布局参照了印象笔记客户端,当然作为练手项目,功能没有那么全面, 作为入门学习应该是够了.适合有react经验的开发者学习,这里不介绍redux等具体使用,和web端使用方式一致, 全部采用最新hooks编写.第一次发文, 把项目遇到的一些问题和经验发出来和大家一起学习

**ps :** 后端采用.net core api编写 , 可以直接调用 , 未放出来


项目已经上传到github，后面还会陆续完善增加功能, 欢迎clone和star

[github地址](https://github.com/wyj580231/WNote)
手头没有mac设备,部分暂未兼容IOS,已经编译成apk, 有兴趣的可以下载使用 , 提取码 nequ

[百度网盘地址](https://pan.baidu.com/s/1LIplS_7OwSNSJaJbKH0mRw)

## 主要技术栈
> 核心组件
* react-native@0.60.4
> 路由导航
* react-navigation@3.11.1 
> native ui
* ui react-native-elements@1.1.0
* react-native-popup-menu@0.15.6
* react-native-modal@11.2.0
* react-native-root-toast@3.1.2
* react-native-touch-id@4.4.1
* react-native-image-crop-picker@0.25.0
> 状态管理
* react-redux@7.1.0 , redux@4.0.4 , redux-saga@1.0.5 , reselect@4.0.0 , immer@3.2.0

　　既然是入门入坑,肯定选择了使用人数最多的库, 基本都是各个模板star最多的, 整体UI本来用的是NativeBase,用了一天发现限制太多了, 虽然功能很全面,布局等基本只能用这个,正好遇到版本不兼容, 里面的list还是老的ListView,最新的react-native已经更新成Flatlist了, 换成了可定制和控制度更高的react-native-elements.
因为web端react使用的阿里的dva和umi框架 , 对redux更熟悉, 数据流就选择了redux,异步中间件redux-saga, 并且参照dva的功能封装了一个简版的dva , 使用api基本一致.
数据不可变上使用immer来修改数据.


## 主要功能
- **done**
- [x] 注册&登陆
- [x] 上传修改头像
- [x] 新建笔记
- [x] 笔记本
- [x] 密码本
- [x] 配置主题
- [x] 应用指纹保护
- [x] 数据同步到后台
- **todo**
- [ ] 富文本编辑
- [ ] 备忘录通知
- [ ] 移动端调试功能(在移动设备上调试前端代码, 试过好几个这类app ,效果都不理想 , 如果后面有时间并且能力足够考虑开发个这个功能集成进去作为高阶功能)
#### 功能截图
![](https://user-gold-cdn.xitu.io/2019/8/22/16cb74b62e625228?w=1080&h=1920&f=jpeg&s=89500)
#### 笔记
![](https://user-gold-cdn.xitu.io/2019/8/22/16cb73dc80bbc0a8?w=1080&h=1920&f=jpeg&s=101628)
#### 编辑
![](https://user-gold-cdn.xitu.io/2019/8/22/16cb73d928804094?w=1080&h=1920&f=jpeg&s=104880)
#### 指纹
![](https://user-gold-cdn.xitu.io/2019/8/22/16cb73ddf6ba54ff?w=1080&h=1920&f=jpeg&s=69378)

# 踩坑过程
## 一.搭建开发环境
手头只有安卓设备和Windows电脑, 只搭建了android的开发环境, 没有使用create-react-native-app,直接用的react-native-cli ,
参照[React Native官网教程](https://reactnative.cn/docs/getting-started/)一步步走下来,官网建议需要翻墙工具 , 测试目前没有翻墙也能正常安装 ,速度也不慢.
#### 主要过程:
- 安装 node (>10)并设置国内镜像源和安装yarn 
- 安装 react-native-cli : npm i -g react-native-cli
- 安装jdk 1.8 , python2 , Android Studio 按照官网配置环境变量
- react-native init \<appName\> 初始化项目
## 二.项目文件结构
<pre><code>
├── node_modules:                   模块文件夹
|   └── ...             
├── android:                        android代码(react-native自动生成)
├── ios:                            ios代码(react-native自动生成)
├── public:                         开发服务运行时的文件根目录(dll也生成在此文件夹)
├── src:                            开发目录(自己建立 ,主要代码都在这里面)
|   ├── assets:                     图片等静态资源
|   ├── components:                 react组件
|   ├── models:                     redux model
|   ├── pages:                      页面文件
|   |   ├── account:                账户
|   |   ├── notes:                  笔记
|   |   ├── ......
|   ├── redux:                      redux使用封装
|   ├── utils:                      工具文件包
|   |   ├── request.js:             基于fetch封装的request请求
|   |   ├── storage.js:             AsyncStorage封装
|   └── api.js:                     api请求
|   └── index.js:                   src入口文件,注入store等全局配置
|   └── App.js:                     路由文件
├── .buckconfig                     自动生成,暂时不了解作用
├── .editorconfig                   编辑器通用配置
├── .eslintignore                   eslint忽略文件配置
├── .eslintrc.js                    eslint配置
├── .flowconfig                     自动生成 
├── .gitignore                      git忽略文件
├── .prettierrc.js                  代码格式美化 prettier配置文件
├── .watchmanconfig                 自动生成,暂时不了解作
├── app.js                          自动生成,应该是项目名称 打包出的apk会取这个可以在其他地方修改,试过直接改这里打包报错
├── babel.config.js                 babel配置
├── metro.config.js                 react-native的打包工具配置 (应该类似webpack吧,欢迎指正)
├── package.json                    项目依赖 npm
</code></pre>

## 三.基础功能封装
### AsyncStorage [官网地址](https://reactnative.cn/docs/asyncstorage/)
使用和web端localstorage的api类似,不过官网建议不要直接使用,而是在AsyncStorage 的基础上做一层抽象封装 ,本来准备直接用封装好的react-native-storage,看了下api实在不喜欢 , 就简单封装了一下 , 保存时在原始数据外加了一层通过JSON.stringify序列化保存, 好处是可以保留数据的类型 , 避免bool和number值保存成字符串.有更好的库欢迎推荐.
```JavaScript
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

```
### redux+redux-saga
web端数据流使用的是阿里的dva, 很好用,简化redux的写法和调用 , 这里没直接用, 而是参照dva的调用方式实现了一个简版 .代码一共一百行左右, 很好理解 , 在src/redux目录下 ,调用方式如下, 在 WRedux传入models数组, 并支持三个参数 initialState,onStageChange和onError,支持在dispatch一个副作用时返回一个promise,在副作用完成时resolve(返回值) 在这里我在onStageChange里把store持久化存入AsyncStorage并在下一次App启动时通过initialState传入以保存应用的状态
```javascript
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import App from './App';
import theme from './config/theme';
import Loading from './components/loading';
import DeviceStorage from './utils/storgae';
import WRedux from './redux';
import app from './models/app';
import note from './models/note';

const AppRoot = () => {
  const [store, setStore] = useState(null);
  useEffect(() => {
    DeviceStorage.get('appState', {}).then(initialState => {
      const models = [app, note];
      const onError = ({ e, action, namespace }) =>
        Alert.alert(
          '系统错误',
          `namespace: ${namespace}\nactionType: ${action.type}\nmessage: ${e.message}\nstack: ${e.stack}`
        );
      const onStateChange = ({ stateChanged, namespace, stateBefore }) => {
        const model = models.find(v => v.namespace === namespace);
        let { storeFields } = model;
        storeFields = storeFields ? (storeFields === 'all' ? Object.keys(stateChanged) : storeFields) : [];
        const stateNeedStore = {};
        storeFields.forEach(key => {
          stateNeedStore[key] = stateChanged[key];
        });
        DeviceStorage.update('appState', { [namespace]: stateNeedStore });
      };
      const wApp = WRedux(models, { initialState, onError, onStateChange });
      const store = wApp.run();
      global.store = store;
      setStore(store);
    });
  }, []);
  return store ? (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MenuProvider backHandler>
          <App />
        </MenuProvider>
      </ThemeProvider>
    </Provider>
  ) : (
    <Loading />
  );
};

export default AppRoot;

```
### 网络请求
用的原生fetch, 和web端api一直, 简单封装了下, 加入api前缀,获取token和错误处理等逻辑 , 调用方式request.post('/api/Book/Sync', { body: data })
```JavaScript
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
```
## 四.主要文件介绍
### 入口文件 注册APP 对比 web端 ReactDOM.render方法
```JavaScript
import { AppRegistry } from 'react-native';
import App from './src/index';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```
### src/index.js 在这里注入store等一些全局配置
```JavaScript
 return store ? (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MenuProvider backHandler>
          <App />
        </MenuProvider>
      </ThemeProvider>
    </Provider>
  ) : (
    <Loading />
  );
```
### src/APP.js react-navigation路由配置  , 使用最新的lazy和Suspense实现懒加载 , 用了两个高阶组件 authRoute(某些页面必须登陆才能访问) ,authPassword(应用密码验证), 路由状态开发时持久化方便调试
```JavaScript
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { lazy, Suspense } from 'react';
import { createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { Dimensions } from 'react-native';
import DrawerContentComponent from './components/drawerContentComponent';
import DeviceStorage from './utils/storgae';
import Loading from './components/loading';
import authRoute from './components/authRoute';
import authPassword from './components/authPassword';

const LazyAccount = lazy(() => import('./pages/account'));
const Account = props => (
  <Suspense fallback={<Loading />}>
    <LazyAccount {...props} />
  </Suspense>
);
    ''''''

const LazySettings = lazy(() => import('./pages/settings'));
const Settings = props => (
  <Suspense fallback={<Loading />}>
    <LazySettings {...props} />
  </Suspense>
);
const WINDOW_WIDTH = Dimensions.get('window').width;
const drawerWidth = Math.min(WINDOW_WIDTH * 0.8, 300);
const Drawer = createDrawerNavigator(
  {
    Home: Notes,
    Books,
    PasswordNotes,
    Settings,
    Account: authRoute(Account),
  },
  {
    initialRouteName: 'Home',
    drawerWidth,
    contentComponent: DrawerContentComponent,
  }
);
const NavStack = createStackNavigator(
  { Drawer, Login, Register, EditNote, ModifyPassword, EditPasswordNote, NotesByBook },
  { initialRouteName: 'Drawer', headerMode: 'none' }
);
const AppContainer = createAppContainer(NavStack);

const persistenceKey = 'persistenceKey';
const persistNavigationState = async navState => {
  await DeviceStorage.set(persistenceKey, navState);
};
const loadNavigationState = async () => {
  const navState = await DeviceStorage.get(persistenceKey);
  return navState;
};
function getPersistenceFunctions(isStore) {
  return isStore
    ? {
        persistNavigationState,
        loadNavigationState,
      }
    : undefined;
}
const App = () => {
  return <AppContainer {...getPersistenceFunctions(__DEV__)} />;
};

export default authPassword(App);
```
### src/models 应用状态数据,参照dva的api state里是redux reducer的初始数据 , effects里是副作用操作(网络请求等) , reducers 类似redux里的reducer, effects和reducer里的函数会自动添加namespace前缀
```JavaScript
export default {
  namespace: 'app',
  state: {
    themes: ['#35BD64', '#1FAB89', '#CBA1C2', '#3A1F5D', '#A4D7E1'],
    activeTheme: 0,
    user: null
    ......
  },
  storeFields: ['activeTheme', 'user', 'useTouchID'],
  effects: {
    *auth(
      { put, call },
      {
        payload: { userName, password, type },
      }
    ) {
      const res = yield call(type === 'login' ? login : register, { userName, password });
      if (res && res.result === 'OK') {
        yield DeviceStorage.set('authorization', 'Bearer ' + res.data.token);
        yield put({
          type: 'app/save',
          payload: {
            user: res.data.user,
          },
        });
      } else {
        return res;
      }
    },
    ......
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    changeTheme(
      state,
      {
        payload: { activeTheme },
      }
    ) {
      return { ...state, activeTheme };
    },
  },
};

```

## 五.遇到的坑点
### 导航组件react-navigation
路由导航用的官方推荐的react-navigation
使用方式参考了react-native-elements的[示例](https://github.com/react-native-elements/react-native-elements-app)
用的抽屉导航createDrawerNavigator死活抽屉拉不出来, 花了一天时间换各种版本, 最后又仔细看了下官网,发现光顾着看api了,[入门教程](https://reactnavigation.org/docs/zh-Hans/getting-started.html)直接略过了, 需要在android java代码改些东西才能生效,最后参照教程修改完终于能正常拉出抽屉了.
### 入口文件执行时机
跟web端不同,android上按返回键退出应用后应用占用的内存不会立即释放 , 在下一次进入应用,js里通过import引入的对象不会改变地址,取到的是上次app退出前的引用, 开始我在index.js的 useEffect里修改过一个import来的对象(实际不应该有这种操作),但是由于取到的是缓存第二次打开应用又对import的对象引用做了二次修改, 状态混乱,排查了很久才发现是这个原因.
## 六.总结
项目中用了react技术栈中一些最新的技术,hooks,redux,redux-saga,reselect,react-navigation等,通过这个项目熟悉了react-native的开发流程, 性能和移动端操作的适配比H5好多了,熟悉react的话可以很快上手.
## 用到的技术学习地址
[精读《Function Component 入门》](https://juejin.im/post/5ceb36dd51882530be7b1585#heading-4)(看过最好的hooks讲解文章)

[React Native中文网](https://reactnative.cn/docs/getting-started.html)

[React Navigation](https://reactnavigation.org/docs/zh-Hans/getting-started.html)

[react-native-elements](https://react-native-training.github.io/react-native-elements/)

[Redux](http://cn.redux.js.org/)

[redux-saga](https://redux-saga-in-chinese.js.org/docs/introduction/BeginnerTutorial.html)

[深入Typescript](https://jkchao.github.io/typescript-book-chinese/typings/overview.html)

[阿里的umi框架(web)](https://umijs.org/zh/guide/)

