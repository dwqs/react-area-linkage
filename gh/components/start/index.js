import './index.less';
import React, {Component, Children} from 'react';

export default class Start extends Component {
    constructor (){
        super ();
    }

    render () {
        return (
            <div className="start">
                <h3>快速开始</h3>
                <div className="install">
                    <h4>安装</h4>
                    <pre>npm i --save react-area-linkage</pre>
                    <p>或者</p>
                    <pre>yarn add react-area-linkage</pre>
                </div>
                <div className="register">
                    <h4>使用</h4>
                    <pre>import React from 'react';<br/><br/>import &#123; AreaSelect, AreaCascader &#125; from 'react-area-linkage';<br/><br/>&lt;AreaSelect/&gt;<br/>&lt;AreaCascader/&gt;</pre>
                </div>
                <br/>
            </div>
        );
    }
}