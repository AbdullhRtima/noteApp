import React, { Fragment } from 'react';
import {Route, Redirect } from 'react-router-dom';

const PrivateRouter=({ component: Component, ...rest })=> (
    <Fragment>
   <Route {...rest} render={(props) => (
    props.isAuth === true
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
   </Fragment>
)
 

export default PrivateRouter ;