import './index.less';

import React, {Component, Children} from 'react';

import Header from '@components/header/index';
import Start from '@components/start/index';
import Main from '@components/main/index';
import Footer from '@components/footer/index';

export default class App extends Component {
    constructor (){
        super ();
    }

    render () {
        return (
            <div className="app-wrap">
                <Header />  
                <Start />
                <Main />
                <Footer />
            </div>
        );
    }
}