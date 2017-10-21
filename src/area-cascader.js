import React, { Component } from 'react';
import { Cascader } from 'antd'; 
import PropTypes from 'prop-types';

import AreaData from 'area-data';

import { assert } from './utils';

export default class AreaCascader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            options: []
        };
    }

    static propTypes = {
        type: PropTypes.string,  // 返回类型：['code', 'text', 'all']
        placeholder: PropTypes.string, 
        level: PropTypes.number,  // 0->二联 1->三联
        size: PropTypes.string, // 大小：['large', 'default', 'small']
        onChange: PropTypes.func 
    };

    static defaultProps = {
        type: 'code',
        placeholder: '请选择',
        level: 0,
        size: 'default'
    };

    iterate (obj) {
        const temp = [];
        for (const key in obj) {
            temp.push({
                label: obj[key],
                value: key
            });
        }
        return temp;
    }

    iterateCities () {
        const temp = [];
        const provinces = this.iterate(AreaData['86']);

        for (let i = 0, l = provinces.length; i < l; i++) {
            const item = {};
            item['label'] = provinces[i].label;
            item['value'] = provinces[i].value;

            item['children'] = this.iterate(AreaData[provinces[i].value]);
            temp.push(item);
        }
        return temp;
    }

    iterateAreas () {
        const temp = [];
        const cities = this.iterateCities();

        for (let i = 0, c = cities.length; i < c; i++) {
            const city = cities[i];
            for (let j = 0, l = cities[i].children.length; j < l; j++) {
                const item = cities[i].children[j];
                item['children'] = this.iterate(AreaData[cities[i].children[j].value]);
            }
            temp.push(city);
        }

        return temp;
    }

    getAreaText (selected) {
        const texts = [];
        const provinces = AreaData['86'];

        for (let i = 0, l = selected.length; i < l; i++) {
            switch (i) {
                case 0:
                    texts.push(provinces[selected[i]]);
                    break;
                case 1:
                    const city = AreaData[selected[0]][selected[i]];
                    texts.push(city);
                    break;
                case 2:
                    const area = AreaData[selected[1]][selected[i]];
                    texts.push(area);
                    break;
            }
        }

        return texts;
    }

    getAreaCodeAndText (selected) {
        const all = [];
        const texts = this.getAreaText(selected);

        assert(texts.length === selected.length, '获取数据出错了');

        for (let i = 0, l = texts.length; i < l; i++) {
            const item = {
                [selected[i]]: texts[i]
            };
            all.push(item);
        }

        return all;
    }

    handleSelectChange = (val) => {
        const { onChange, type } = this.props;

        if(typeof onChange === 'function') {
            if(type === 'code') {
                onChange(val);
            } else if (type === 'text') {
                onChange(this.getAreaText(val));
            } else if (type === 'all') {
                onChange(this.getAreaCodeAndText(val));
            }
        }
    }

    render () {
        const { options } = this.state;
        let { size, type, placeholder, level } = this.props;

        if(!['large', 'default', 'small'].includes(size)) {
            size = 'default';
        }

        if(!['all', 'code', 'text'].includes(type)) {
            type = 'code';
        }

        if(![0,1].includes(level)) {
            level = 0;
        }

        let defaultClass = 'area-cascader';
        let classes = size === 'default' ? 'medium' : size === 'small' ? 'small' : 'large';
        classes = `${defaultClass} ${classes}`;

        return (
            <div className={classes}>
                <Cascader 
                    placeholder={placeholder} 
                    size={size} 
                    options={options} 
                    onChange={this.handleSelectChange} />
            </div>
        );
    }

    componentDidMount () {
        const { level } = this.props;

        if (level === 0) {
            this.setState({
                options: this.iterateCities()
            });
            return;
        }

        if (level === 1) {
            this.setState({
                options: this.iterateAreas()
            });
            return;
        }
    }
}