import React, { Component } from 'react';
import { Select } from 'antd'; 
import PropTypes from 'prop-types';

import AreaData from 'area-data';
import find from 'lodash.find';

import { assert, isArray } from './utils';

const Option = Select.Option;

export default class AreaSelect extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 区域数据
            provinces: AreaData['86'],
            citys: {},
            areas: {},
            streets: {},

            // state
            curProvince: undefined,
            curProvinceCode: undefined,
            curCity: undefined,
            curCityCode: undefined,
            curArea: undefined,
            curAreaCode: undefined,
            curStreet: undefined,
            curStreetCode: undefined,

            // 设置默认值的判断
            defaults: [],
            isCode: false,
            isSetDefault: false
        };
    }

    static propTypes = {
        type: PropTypes.string,  // 返回类型：['code', 'text', 'all']
        placeholders: PropTypes.array, 
        level: PropTypes.number,  // 0-->一联 1->二联 2->三联 3->四联
        size: PropTypes.string, // 大小：['large', 'default', 'small']
        defaultArea: [], // 默认值
        onChange: PropTypes.func 
    };

    static defaultProps = {
        type: 'code',
        placeholders: [],
        level: 1,
        size: 'default',
        defaultArea: []
    };

    getAreaCode () {
        const { level } = this.props;
        const { curProvinceCode, curCityCode, curAreaCode, curStreetCode } = this.state;
        let selected = [];

        switch (level) {
            case 0:
                selected = [curProvinceCode];
                break;
            case 1:
                selected = [curProvinceCode, curCityCode];
                break;
            case 2:
                selected = [curProvinceCode, curCityCode, curAreaCode];
                break;
            case 3:
                selected = [curProvinceCode, curCityCode, curAreaCode, curStreetCode];
                break;
        }

        return selected;
    }   

    getAreaText () {
        const { level } = this.props;
        const { curProvince, curCity, curArea, curStreet } = this.state;
        
        let texts = [];
        
        switch (level) {
            case 0:
                texts = [curProvince];
                break;
            case 1:
                texts = [curProvince, curCity];
                break;
            case 2:
                texts = [curProvince, curCity, curArea];
                break;
            case 3:
                texts = [curProvince, curCity, curArea, curStreet];
                break;
        }

        return texts;
    }

    getAreaCodeAndText () {
        const { level } = this.props;
        const { 
            curProvince, curCity, curArea, curStreet,
            curProvinceCode, curCityCode, curAreaCode, curStreetCode  
        } = this.state;

        let textCodes = [];

        switch (level) {
            case 0:
                textCodes = [{[curProvinceCode]: curProvince}];
                break;
            case 1:
                textCodes = [{[curProvinceCode]: curProvince}, {[curCityCode]: curCity}];
                break;
            case 2:
                textCodes = [{[curProvinceCode]: curProvince}, {[curCityCode]: curCity}, {[curAreaCode]: curArea}];
                break;
            case 3:
                textCodes = [{[curProvinceCode]: curProvince}, {[curCityCode]: curCity}, {[curAreaCode]: curArea}, {[curStreetCode]: curStreet}];
                break;
        }

        return textCodes;
    }

    callback () {
        const { onChange, type } = this.props;
        
        if(typeof onChange === 'function') {
            if(type === 'code') {
                onChange(this.getAreaCode());
            } else if (type === 'text') {
                onChange(this.getAreaText());
            } else if (type === 'all') {
                onChange(this.getAreaCodeAndText());
            }
        }
    }

    handleProvinceChange = (provinceCode) => {
        const { provinces, defaults, isCode } = this.state;
        const curProvince = provinces[provinceCode];

        const citys = AreaData[provinceCode];
        let curCity = Object.values(citys)[0];
        let curCityCode = Object.keys(citys)[0];

        if(this.props.level >= 1 && defaults[1]) {
            if(isCode) {
                curCity = find(Object.keys(citys), (item) => item === defaults[1]);
                assert(curCity, `城市 ${defaults[1]} 不存在于省份 ${defaults[0]} 中`);
                curCityCode = defaults[1];
            } else {
                curCity = find(citys, (item) => item === defaults[1]);
                assert(curCity, `城市 ${defaults[1]} 不存在于省份 ${defaults[0]} 中`);
                curCityCode = find(Object.keys(citys), (item) => citys[item] === defaults[1]);                
            }
        }

        const areas = AreaData[curCityCode];
        let curArea = Object.values(areas)[0];
        let curAreaCode = Object.keys(areas)[0];

        if(this.props.level >= 2 && defaults[2]) {
            if(isCode) {
                curArea = find(Object.keys(areas), (item) => item === defaults[2]);
                assert(curArea, `县区 ${defaults[2]} 不存在于城市 ${defaults[1]} 中`);
                curAreaCode = defaults[2];
            } else {
                curArea = find(areas, (item) => item === defaults[2]);
                assert(curArea, `县区 ${defaults[2]} 不存在于城市 ${defaults[1]} 中`);
                curAreaCode = find(Object.keys(areas), (item) => areas[item] === defaults[2]);
            }
        }

        const streets = AreaData[curAreaCode];
        let curStreet = Object.values(streets)[0];
        let curStreetCode = Object.keys(streets)[0];

        if(this.props.level >= 3 && defaults[3]) {
            if(isCode) {
                curStreet = find(Object.keys(streets), (item) => item === defaults[3]);
                assert(curStreet, `街道 ${defaults[3]} 不存在于县区 ${defaults[2]} 中`);
                curStreetCode = defaults[3];
            } else {
                curStreet = find(streets, (item) => item === defaults[3]);
                assert(curStreet, `街道 ${defaults[3]} 不存在于县区 ${defaults[3]} 中`);
                curStreetCode = find(Object.keys(streets), (item) => streets[item] === defaults[3]);
            }
        }

        this.setState({
            curProvince,
            curProvinceCode: provinceCode,
            curCity,
            curCityCode,
            citys,
            areas,
            curArea,
            curAreaCode,
            streets,
            curStreet,
            curStreetCode
        }, () => {
            this.callback();
        });
    }

    handleCityChange = (cityCode) => {
        const curCity = this.state.citys[cityCode];

        const areas = AreaData[cityCode];
        const curArea = Object.values(areas)[0];
        const curAreaCode = Object.keys(areas)[0];

        const streets = AreaData[curAreaCode];
        const curStreet = Object.values(streets)[0];
        const curStreetCode = Object.keys(streets)[0];

        this.setState({
            curCity,
            curCityCode: cityCode,
            curArea,
            curAreaCode,
            curStreet,
            curStreetCode
        }, () => {
            this.callback();
        });
    }

    handleAreaChange = (areaCode) => {
        const curArea = this.state.areas[areaCode];

        const streets = AreaData[areaCode];
        const curStreet = Object.values(streets)[0];
        const curStreetCode = Object.keys(streets)[0];

        this.setState({
            curArea,
            curAreaCode: areaCode,
            curStreet,
            curStreetCode
        }, () => {
            this.callback();
        });
    }

    handleStreetChange = (streetCode) => {
        const curStreet = this.state.streets[areaCode];
        this.setState({
            curStreet,
            curStreetCode: streetCode
        }, () => {
            this.callback();
        });
    }

    render () {
        let { size, type, placeholders, level } = this.props;
        let { provinces, citys, areas, streets, curProvince, curCity, curArea, curStreet } = this.state;

        if(!['large', 'default', 'small'].includes(size)) {
            size = 'default';
        }

        if(!['all', 'code', 'text'].includes(type)) {
            type = 'code';
        }

        if(![0,1,2,3].includes(level)) {
            level = 2;
        }

        if(!isArray(placeholders)) {
            placeholders = [];
        }

        let defaultClass = 'area-select';
        let classes = size === 'default' ? 'medium' : size === 'small' ? 'small' : 'large';
        classes = `${defaultClass} ${classes}`;

        // ant design 的一个 bug: value 为时, placeholder 才显示
        return (
            <div className={classes}>
                <Select 
                    placeholder={placeholders[0] ? placeholders[0] : '请选择'}
                    notFoundContent='无数据'
                    size={size}
                    value={curProvince}
                    onChange={this.handleProvinceChange}
                >
                    {
                        Object.keys(provinces).map((code) => {
                            return <Option key={code}>{provinces[code]}</Option>;
                        })
                    }
                </Select>
                {
                    level >= 1 && 
                    <Select 
                        placeholder={placeholders[1] ? placeholders[1] : '请选择'}
                        notFoundContent='无数据'
                        size={size}
                        value={curCity}
                        onChange={this.handleCityChange}
                    >
                        {
                            Object.keys(citys).map((code) => {
                                return <Option key={code}>{citys[code]}</Option>;
                            })
                        }
                    </Select>
                }
                {
                    level >= 2 && 
                    <Select 
                        placeholder={placeholders[2] ? placeholders[2] : '请选择'}
                        notFoundContent='无数据'
                        size={size}
                        value={curArea}
                        onChange={this.handleAreaChange}
                    >
                        {
                            Object.keys(areas).map((code) => {
                                return <Option key={code}>{areas[code]}</Option>;
                            })
                        }
                    </Select>
                }
                {
                    level >= 3 && 
                    <Select 
                        placeholder={placeholders[3] ? placeholders[3] : '请选择'}
                        notFoundContent='无数据'
                        size={size}
                        value={curStreet}
                        onChange={this.handleStreetChange}
                    >
                        {
                            Object.keys(streets).map((code) => {
                                return <Option key={code}>{streets[code]}</Option>;
                            })
                        }
                    </Select>
                }
            </div>
        );
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

        // 映射默认值，避免直接更改props
        this.setState({
            isCode,
            defaults: defaultArea,
            isSetDefault: true
        }, () => {
            this.setDefaultValue();
        });
    }

    setDefaultValue () {
        let provinceCode = '';

        if (this.state.isCode) {
            provinceCode = this.state.defaults[0];
        } else {
            const province = find(this.state.provinces, (item) => item === this.state.defaults[0]);
            assert(province, `省份 ${this.state.defaults[0]} 不存在`);
            provinceCode = find(Object.keys(this.state.provinces), (item) => this.state.provinces[item] === this.state.defaults[0]);
        }
        
        this.handleProvinceChange(provinceCode);
        // 还原默认值，避免用户选择出错
        this.setState({
            defaults: [],
            isCode: false
        });
    }

    componentDidMount () {
        const { defaultArea } = this.props;
        if (isArray(defaultArea) && defaultArea.length) {
            this.beforeSetDefault();
        }
    }
}