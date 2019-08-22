import request from './utils/request';

// const mock = (data: any = null, delay = 1000) =>
//   new Promise(resolve => setTimeout(() => resolve({ result: 'OK', data }), delay));
//账户相关
export function login(user) {
  return request.post('/api/Auth/Login', { body: user, isAutoAlert: false });
}
export function register(user) {
  return request.post('/api/Auth/Register', { body: user, isAutoAlert: false });
}
export function uploadAvatar(path) {
  let formData = new FormData();
  const name = path.split('/').pop();
  let file = { uri: path, type: 'application/octet-stream', name };
  formData.append('file', file);
  return request.post('/api/Account/UploadAvatar', {
    ContentType: 'multipart/form-data',
    body: formData,
    isProcessBody: false,
  });
}
export function modifyAccount(user) {
  return request.put('/api/Account', { body: user });
}
//笔记相关
export function getBooks() {
  return request('/api/Book');
}

export function getNotes() {
  return request('/api/Note');
}

export function getPasswordNotes() {
  return request('/api/PasswordNote');
}

export function syncBooks(data) {
  return request.post('/api/Book/Sync', { body: data });
}

export function syncNotes(data) {
  return request.post('/api/Note/Sync', { body: data });
}
export function syncPasswordNotes(data) {
  return request.post('/api/PasswordNote/Sync', { body: data });
}
