/**
 * Created by pomy on 23/07/2017.
 */

import React, {Component} from 'react';

import {Route, Switch} from 'react-router-dom';
import {getAsyncComponent} from 'async-react-component';

const App = () => import(/* webpackChunkName: "main" */ '../general/app/index');
const Info = () => import(/* webpackChunkName: "info" */ '@components/info/index');
const ToDo = () => import(/* webpackChunkName: "todo" */ '../general/todo/index');

const routes =
    <Switch>
        <Route exact path='/' component={getAsyncComponent(App)}></Route>
        <Route path='/info' component={getAsyncComponent(Info)}></Route>
        <Route path='/todo' component={getAsyncComponent(ToDo)}></Route>
        <Route render={() => <div>404 not found</div>}></Route>
    </Switch>;

export default routes;
