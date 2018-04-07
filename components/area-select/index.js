import React from 'react';
import PropTypes from 'prop-types';

import AreaData from 'area-data';
import find from 'lodash.find';

import Select from './select/index';
import Option from './select/option';

import { assert, isArray } from '@src/utils';

export default class AreaSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 区域数据
            provinces: AreaData['86'],
            citys: {},
            areas: {},

            // state
            curProvince: '', // text
            curProvinceCode: '', // code
            curCity: '',
            curCityCode: '',
            curArea: '',
            curAreaCode: '',

            // 设置默认值的判断
            defaults: [],
            isCode: false,
            isSetDefault: false
        };
    }
    
    static propTypes = {
        value: PropTypes.array,
        type: PropTypes.oneOf(['code', 'text', 'all']),  // 返回类型
        placeholders: PropTypes.array, 
        level: PropTypes.oneOf([0, 1, 2]),  // 0-->一联 1->二联 2->三联
        size: PropTypes.oneOf(['small', 'medium', 'large']), // 大小
        defaultArea: PropTypes.array, // 默认值
        onChange: PropTypes.func,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        type: 'code',
        placeholders: [],
        level: 1,
        size: 'medium',
        defaultArea: [],
        disabled: false,
        value: []
    }

    getAreaCode () {
        const { level } = this.props;
        const { curProvinceCode, curCityCode, curAreaCode } = this.state;
        let codes = [];

        switch (level) {
            case 0:
                codes = [curProvinceCode];
                break;
            case 1:
                codes = [curProvinceCode, curCityCode];
                break;
            case 2:
                codes = [curProvinceCode, curCityCode, curAreaCode];
                break;
        }

        return codes;
    }   

    getAreaText () {
        const { level } = this.props;
        const { curProvince, curCity, curArea } = this.state;
        
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
        }

        return texts;
    }

    getAreaCodeAndText () {
        const { level } = this.props;
        const { 
            curProvince, curCity, curArea,
            curProvinceCode, curCityCode, curAreaCode  
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
        }

        return textCodes;
    }

    provinceChange (code, text) {
        const { level } = this.props;

        if (level ===  0) {
            this.setState({
                curProvince: text,
                curProvinceCode: code
            }, this.selectChange);
        } else if (level === 1) {
            const citys = AreaData[code];
            if (!citys) {
                assert(citys, `(城市)地区数据出现了错误`);
                return;
            }

            const curCity = Object.values(citys)[0];
            const curCityCode = Object.keys(citys)[0];

            this.setState({
                curProvince: text,
                curProvinceCode: code,
                curCity,
                curCityCode,
                citys
            }, this.selectChange);
        } else if (level === 2) {
            const citys = AreaData[code];
            if (!citys) {
                assert(citys, `(城市)地区数据出现了错误`);
                return;
            }

            const curCity = Object.values(citys)[0];
            const curCityCode = Object.keys(citys)[0];

            const areas = AreaData[curCityCode];

            if (!areas) {
                assert(areas, `(市区)地区数据出现了错误`);
                return;
            }

            const curArea = Object.values(areas)[0];
            const curAreaCode = Object.keys(areas)[0];

            this.setState({
                curProvince: text,
                curProvinceCode: code,
                curCity,
                curCityCode,
                curArea,
                curAreaCode,
                citys,
                areas
            }, this.selectChange);
        } else {
            assert(false, `设置的 level 值只支持 0/1/2`);
        }
    }

    cityChange (code, text) {
        const { level } = this.props;

        if (level === 1) {
            this.setState({
                curCity: text,
                curCityCode: code
            }, this.selectChange);
        } else if (level === 2) {
            const areas = AreaData[code];

            if (!areas) {
                assert(areas, `(市区)地区数据出现了错误`);
                return;
            }

            const curArea = Object.values(areas)[0];
            const curAreaCode = Object.keys(areas)[0];

            this.setState({
                curCity: text,
                curCityCode: code,
                areas,
                curArea,
                curAreaCode,
            }, this.selectChange);
        }
    }

    areaChange (code, text) {
        const { level } = this.props;

        this.setState({
            curArea: text,
            curAreaCode: code,
        }, this.selectChange);
    }

    selectChange () {
        const { onChange, type } = this.props;
        const { curProvince, curProvinceCode, curCity, curCityCode, curArea, curAreaCode } = this.state;
        
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

    renderSelectComponent (val, level, cb, data) {
        const { size, placeholders, ...rest } = this.props;
        const { curProvince, curCity, curArea } = this.state;
        const label = level === 0 ? curProvince : level === 1 ? curCity : curArea;

        return (
            <Select 
                {...rest}
                value={val} 
                label={label}
                placeholder={placeholders[level] ? placeholders[level] : '请选择'} 
                size={size}
                onChange={cb}
            >
                {
                    Object.keys(data).length ? 
                        Object.keys(data).map((code) => {
                            return <Option key={code} value={code} label={data[code]}></Option>;
                        }) : 
                        <p  className='area-select-empty'>暂无数据</p> 
                }
            </Select>
        );
    }

    render () {
        const { provinces, citys, areas, curProvince, curCity, curArea } = this.state;
        let { size, type, placeholders, level } = this.props;

        if(!['large', 'medium', 'small'].includes(size)) {
            size = 'medium';
        }

        if(!['all', 'code', 'text'].includes(type)) {
            type = 'code';
        }

        if(![0,1,2].includes(level)) {
            level = 1;
        }

        if(!isArray(placeholders)) {
            placeholders = [];
        }

        return (
            <div className='area-select-wrap'>
                { this.renderSelectComponent(curProvince, 0, this.provinceChange.bind(this), provinces) }
                {
                    level >= 1 ? this.renderSelectComponent(curCity, 1, this.cityChange.bind(this), citys) : null
                }
                {
                    level >= 2 ? this.renderSelectComponent(curArea, 2, this.areaChange.bind(this), areas) : null
                }
            </div>
        );
    }

    componentDidMount () {
        // TODO: 设置默认值
    }
}