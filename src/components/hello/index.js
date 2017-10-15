/**
 * Created by pomy on 20/07/2017.
 */

import './index.less';

import React, {PureComponent} from 'react';

export default class Hello extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            desc: 'A simple template webpack 3 + react 15 + react-router 4 setup for projects'
        }
    }

    render() {
        return (
            <div className="desc">
                <p>{this.state.desc}</p>
                <img src="/assets/logo.png" alt="logo" style={{margin: "10px"}}/>
            </div>
        )
    }
}
