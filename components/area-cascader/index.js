import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AreaData from 'area-data';
import find from 'lodash.find';

import Cascader from './cascader/index';

import { assert, isArray } from '@src/utils';

import Emitter from './emit';

export default class AreaCascader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 区域数据
            provinces: AreaData['86'],
            options: [],

            // 设置默认值的判断
            defaults: [],
            isCode: false,
            isSetDefault: false
        };
        // 避免多个 AreaCascader 组件的影响
        this.emitter = new Emitter();
    }
    
    static displayName = 'AreaCascader'

    static propTypes = {
        type: PropTypes.oneOf(['code', 'text', 'all']),  // 返回类型
        placeholder: PropTypes.string, 
        level: PropTypes.oneOf([0, 1]),  // 0->二联 1->三联
        size: PropTypes.oneOf(['small', 'medium', 'large']), // 大小
        defaultArea: PropTypes.array, // 默认值
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        separator: PropTypes.string
    }

    static defaultProps = {
        type: 'code',
        placeholder: '请选择',
        level: 0,
        size: 'medium',
        defaultArea: [],
        disabled: false,
        separator: '/'
    }

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
            for (let j = 0, l = city.children.length; j < l; j++) {
                const item = city.children[j];
                const areas = this.iterate(AreaData[city.children[j].value]);
                // fix: https://github.com/dwqs/vue-area-linkage/issues/7
                if (areas.length) {
                    item['children'] = areas;
                } else {
                    item['children'] = [{
                        label: item.label,
                        value: item.value
                    }];
                }
            }
            temp.push(city);
        }

        return temp;
    }

    handleSelectChange = (codes, labels) => {
        const { onChange, type } = this.props;
        
        assert(codes.length === labels.length, '地区数据可能出错了');
        if (this.state.isSetDefault) {
            this.emitter.emit('set-def-values', codes, labels);
        }

        if (labels[0] === labels[1]) {
            // fix #2: 纠正台湾省的 code 返回
            codes[1] = codes[0];
        }

        if(typeof onChange === 'function') {
            if(type === 'code') {
                onChange(codes);
            } else if (type === 'text') {
                onChange(labels);
            } else if (type === 'all') {
                onChange(codes.map((code, index) => {
                    return {
                        [code]: labels[index]
                    };
                }));
            }
        }
    }

    beforeSetDefault () {
        const { defaultArea } = this.props;
        const chinese = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,}$/;
        const num = /^\d{6,}$/;
        const isCode = num.test(defaultArea[0]);

        let isValid;

        if (!isCode) {
            isValid = defaultArea.every((item) => chinese.test(item));
        } else {
            isValid = defaultArea.every((item) => num.test(item));
        }
        assert(isValid, '传入的默认值参数有误');

        // 映射默认值，避免直接更改props
        this.setState({
            isCode,
            defaults: defaultArea,
            isSetDefault: true
        }, () => {
            this.setDefVal();
        });
    }

    setDefVal () {
        const { provinces, defaults, isCode } = this.state;
        const { level } = this.props;

        let provinceCode = '';
        let province = '';

        if (isCode) {
            provinceCode = defaults[0];
            province = provinces[provinceCode];
        } else {
            province = find(provinces, (item) => item === defaults[0]);
            assert(province, `省份 ${defaults[0]} 不存在`);
            provinceCode = find(Object.keys(provinces), (item) => provinces[item] === defaults[0]);
        }

        const citys = AreaData[provinceCode];

        if (!citys) {
            assert(citys, `(城市)地区数据出现了错误`);
            return;
        }

        let curCity = Object.values(citys)[0];
        let curCityCode = Object.keys(citys)[0];
        
        if(defaults[1]) {
            if(isCode) {
                curCityCode = find(Object.keys(citys), (item) => item === defaults[1]);
                assert(curCityCode, `城市 ${defaults[1]} 不存在于省份 ${defaults[0]} 中`);
                curCity = citys[curCityCode];
            } else {
                curCity = find(citys, (item) => item === defaults[1]);
                assert(curCity, `城市 ${defaults[1]} 不存在于省份 ${defaults[0]} 中`);
                curCityCode = find(Object.keys(citys), (item) => citys[item] === defaults[1]);                
            }
        }

        if (level === 0) {
            this.handleSelectChange([provinceCode, curCityCode], [province, curCity]);
        } else if (level === 1) {
            const areas = AreaData[curCityCode];

            if (!areas) {
                assert(areas, `(市区)地区数据出现了错误`);
                return;
            }

            let curArea = Object.values(areas)[0];
            let curAreaCode = Object.keys(areas)[0];

            if (defaults[2]) {
                if(isCode) {
                    curAreaCode = find(Object.keys(areas), (item) => item === defaults[2]);
                    assert(curArea, `县区 ${defaults[2]} 不存在于城市 ${defaults[1]} 中`);
                    curArea = areas[curAreaCode];
                } else {
                    curArea = find(areas, (item) => item === defaults[2]);
                    assert(curArea, `县区 ${defaults[2]} 不存在于城市 ${defaults[1]} 中`);
                    curAreaCode = find(Object.keys(areas), (item) => areas[item] === defaults[2]);
                }
            }
            this.handleSelectChange([provinceCode, curCityCode, curAreaCode], [province, curCity, curArea]);
        } else {
            assert(false, `设置的默认值和 level 值不匹配`);
        }
        
        
        // 还原默认值，避免用户选择出错
        this.setState({
            defaults: []
        });
    }

    render () {
        const { options } = this.state;
        let { size, placeholder, disabled, separator } = this.props;

        if(!['large', 'medium', 'small'].includes(size)) {
            size = 'medium';
        }

        return (
            <div className='area-cascader-wrap'>
                <Cascader 
                    placeholder={placeholder} 
                    size={size} 
                    emitter={this.emitter}
                    options={options}
                    disabled={disabled} 
                    separator={separator} />
            </div>
        );
    }

    componentDidMount () {
        const { level, defaultArea } = this.props;

        if (level === 0) {
            this.setState({
                options: this.iterateCities()
            });
        } else if (level === 1) {
            this.setState({
                options: this.iterateAreas()
            });
        } else {
            assert(false, `设置的 level 值只支持 0/1`);
        }

        if (isArray(defaultArea) && defaultArea.length === level + 2) {
            this.beforeSetDefault();
        }

        if (isArray(defaultArea)  && defaultArea.length &&  defaultArea.length !== level + 2) {
            assert(false, `设置的默认值和 level 值不匹配`);
        }

        this.emitter.on('selected', this.handleSelectChange);
    }

    componentDidUpdate () {
        const { defaultArea, level } = this.props;
        const { isSetDefault } = this.state;
        
        if (!isSetDefault && isArray(defaultArea) && defaultArea.length === level + 2) {
            this.beforeSetDefault();
        }

        if (!isSetDefault && isArray(defaultArea) && defaultArea.length && defaultArea.length !== level + 2) {
            assert(false, `设置的默认值和 level 值不匹配`);
        }
    }

    componentWillUnmount () {
        this.emitter.destroyed();
        this.emitter = null;
    }
}