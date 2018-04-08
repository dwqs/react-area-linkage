import './index.less';

import React, {Component, Children} from 'react';

import Header from '@components/header/index';
import Start from '@components/start/index';
import Main from '@components/main/index';
import Footer from '@components/footer/index';

import AreaSelect from '../../../components/area-select/index';
import AreaCascader from '../../../components/area-cascader/index';

export default class App extends Component {
    constructor (){
        super ();
        this.state = {
            selected: [] //['广东省', '深圳市', '南山区'] //['440000','440300','440305']
        };
    }

    onChange = (val) => {
        console.log('aaaaaa', val);
    }

    render () {
        return (
            <div className="app-wrap">
                {
                    // <p>1</p>
                    // <p>1</p>
                    // <p>1</p>
                    // <p>1</p>
                    // <p>1</p>
                    // <AreaCascader onChange={this.onChange} level={1}/>
                    // <AreaSelect  level={1} onChange={this.onChange}/>
                }
                <Header />  
                <Start />
                <Main />
                <Footer />
            </div>
        );
    }

    componentDidMount () {
        // setTimeout(() => {
        //     this.setState({
        //         selected: ['440000','440300','440305']
        //     });
        // }, 2000);
    }
}