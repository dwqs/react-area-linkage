import React, {Component, Children} from 'react';

export default class Footer extends Component {
    constructor (){
        super ();
    }

    render () {
        return (
            <footer>
                <p>Vue 版本：<a target="_blank" href="https://github.com/dwqs/vue-area-linkage">Vue Area Linkage</a></p>
                <p>最新数据来源：<a href="https://github.com/dwqs/area-data" target="_blank">省/市/区/街道数据</a></p>
                <p>官方数据：<a href="http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2016/index.html" target="_blank">国家统计局-城乡划分</a></p>
                <p>官方数据：<a href="http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html" target="_blank">国家统计局-县及以上行政区划分</a></p>
            </footer>       
        );
    }
}