import './reset.less';

import React, {Component, Children} from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from '../general/app/index';

const env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    window.onload = function () {
        const render = Component => {
            ReactDOM.render(
                <AppContainer>
                    <Component />
                </AppContainer>,
                document.getElementById('app')
            );
        };

        render(App);

        // HMR
        if (module.hot) {
            module.hot.accept('../general/app/index', () => { render(App); });
        }
    };
} else {
    window.onload = function () {
        ReactDOM.render(
            <App />,
            document.getElementById('app')
        );
    };
}
