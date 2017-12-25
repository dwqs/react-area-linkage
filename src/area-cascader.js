import React, { Component } from 'react';
import { Cascader } from 'antd'; 
import PropTypes from 'prop-types';

import AreaData from 'area-data';
import find from 'lodash.find';

import { assert, isArray } from './utils';

export default class AreaCascader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            provinces: AreaData['86'],
            options: [],
            defVal: [],
            defValCode: ['440000','440300','440305'],
            isSetDefault: false,
            isCode: false
        };
    }

    static propTypes = {
        type: PropTypes.string,  // 返回类型：['code', 'text', 'all']
        placeholder: PropTypes.string, 
        level: PropTypes.number,  // 0->二联 1->三联
        size: PropTypes.string, // 大小：['large', 'default', 'small']
        onChange: PropTypes.func,
        defaultArea: PropTypes.array
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

    beforeSetDefault () {
        const { defaultArea } = this.props;
        const chinese = /^[\u4E00-\u9FA5\uF900-\uFA2D]{3,}$/;
        const num = /^\d{6,}$/;
        const isCode = num.test(defaultArea[0]);

        let isValid;

        if (!isCode) {
            isValid = defaultArea.every((item) => chinese.test(item));
        } else {
            isValid = defaultArea.every((item) => num.test(item));
        }
        assert(isValid, '传入的默认值参数有误');

        this.setState({
            isCode,
            defVal: defaultArea,
            isSetDefault: true
        }, () => {
            this.setDefaultValue();
        });
    }

    setDefaultValue () {
        let provinceCode = '';
        let cityCode = '';
        let areaCode = '';

        if (this.state.isCode) {
            provinceCode = this.state.defVal[0];
        } else {
            const province = find(this.state.provinces, (item) => item === this.state.defVal[0]);
            assert(province, `省份 ${this.state.defVal[0]} 不存在`);
            provinceCode = find(Object.keys(this.state.provinces), (item) => this.state.provinces[item] === this.state.defVal[0]);
        }

        const citys = AreaData[provinceCode];

        if (this.state.isCode) {
            const city = find(Object.keys(citys), (item) => item === this.state.defVal[1]);
            assert(city, `城市 ${this.state.defVal[1]} 不存在于省份 ${this.state.defVal[0]} 中`);
            cityCode = this.state.defVal[1];
        } else {
            const city = find(citys, (item) => item === this.state.defVal[1]);
            assert(city, `城市 ${this.state.defVal[1]} 不存在于省份 ${this.state.defVal[0]} 中`);
            cityCode = find(Object.keys(citys), (item) => citys[item] === this.state.defVal[1]);
        }
        const areas = AreaData[cityCode];
        if (this.state.defVal[2]) {
            if (areas) {
                if (this.state.isCode) {
                    const curArea = find(Object.keys(areas), (item) => item === this.state.defVal[2]);
                    assert(curArea, `县区 ${this.state.defVal[2]} 不存在于城市 ${this.state.defVal[1]} 中`);
                    areaCode = curArea;
                } else {
                    const curArea = find(areas, (item) => item === this.state.defVal[2]);
                    assert(curArea, `县区 ${this.state.defVal[2]} 不存在于城市 ${this.state.defVal[1]} 中`);
                    areaCode = find(Object.keys(areas), (item) => areas[item] === this.state.defVal[2]);
                }
            } else {
                areaCode = cityCode;
            }
        }

        const defValCode = [provinceCode, cityCode, areaCode];
        this.setState({
            defValCode: defValCode
        }, () => {
            this.forceUpdate();
        });
        this.handleSelectChange(defValCode);
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
                    defaultValue={this.state.defValCode}
                    options={options} 
                    onChange={this.handleSelectChange} />
            </div>
        );
    }

    componentDidMount () {
        const { level, defaultArea } = this.props;
        if (isArray(defaultArea) && defaultArea.length >= 2) {
            this.beforeSetDefault();
        }

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