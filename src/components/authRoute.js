import React from 'react';
import { connect } from 'react-redux';
import Login from '../pages/login';

export default WrappedComponent =>
  connect(({ app: { user } }) => ({ user }))(props => {
    const { user } = props;
    const isLogin = !!user;
    return isLogin ? <WrappedComponent {...props} /> : <Login noRedirect />;
  });
