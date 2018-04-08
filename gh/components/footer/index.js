import React, {Component, Children} from 'react';

export default class Footer extends Component {
    constructor (){
        super ();
    }

    render () {
        return (
            <footer>
                <p>Vue 版本：<a target="_blank" href="https://github.com/dwqs/vue-area-linkage">Vue Area Linkage</a></p>
                <p>最新数据来源：<a href="https://github.com/dwqs/area-data" target="_blank">省/市/区数据</a></p>
                <p>官方数据：<a href="http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2016/index.html" target="_blank">国家统计局-城乡划分</a></p>
            </footer>       
        );
    }
}