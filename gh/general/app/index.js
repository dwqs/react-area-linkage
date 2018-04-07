import './index.less';

import React, {Component, Children} from 'react';

import Header from '@components/header/index';
import Start from '@components/start/index';
import Main from '@components/main/index';
import Footer from '@components/footer/index';

import AreaSelect from '../../../components/area-select';

export default class App extends Component {
    constructor (){
        super ();
    }

    onChange = (val) => {
        console.log('aaaaaa', val);
    }

    render () {
        return (
            <div className="app-wrap">
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <AreaSelect level={2} onChange={this.onChange}/>
                <Header />  
                <Start />
                {
                    // <Main />
                }
                <Footer />
            </div>
        );
    }
}