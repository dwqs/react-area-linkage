![npm-version](https://img.shields.io/npm/v/react-area-linkage.svg) ![license](https://img.shields.io/npm/l/react-area-linkage.svg)
# react-area-linkage
省市区联动选择，组合数据来源：[area-data](https://github.com/dwqs/area-data)

## Installation
Install the pkg with npm:
```
// v3之前的版本
npm i --save react-area-linkage

// v3及之后的版本
npm i --save react-area-linkage area-data
```

or yarn

```
// v3之前的版本
yarn add react-area-linkage

// v3及之后的版本
yarn add react-area-linkage area-data
```

## Usage
```
import React from 'react';
import ReactDOM from 'react-dom';
import { pca, pcaa } from 'area-data'; // v3 or higher
import 'react-area-linkage/dist/index.css'; // v2 or higher
import { AreaSelect, AreaCascader } from 'react-area-linkage';

// basic
<AreaSelect onChange={this.selectedChange} data={pca} />
<AreaCascader onChange={this.selectedChange} data={pcaa}/>

//setting
<AreaSelect type='all' level={2} data={pcaa} onChange={this.selectedChange} />
<AreaCascader type='all' onChange={this.selectedChange} level={1} data={pcaa} />
```

More demo to visit [here](https://dwqs.github.io/react-area-linkage/).

## On Demand Import
> version >= 2.0.0

安装 [babel-plugin-on-demand-import](https://github.com/dwqs/babel-plugin-on-demand-import): 

```
npm i babel-plugin-on-demand-import -D
```

修改 `.babelrc`: 

```
{
    // ...
    "plugins": [
        ["on-demand-import" {
            "libraryName": "react-area-linkage",
            "libraryPath": "dist/lib"
        }]
    ]
}
```

```
import 'react-area-linkage/dist/index.css'; // v2 or higher
import pcaa from 'area-data/pcaa';
// Only import AreaCascader component
import { AreaCascader } from 'react-area-linkage';

<AreaCascader onChange={this.selectedChange} level={2} data={pcaa}></AreaCascader>

// Only import AreaSelect component
import { AreaSelect } from 'react-area-linkage'; 

<AreaSelect onChange={this.selectedChange} level={1} data={pcaa}></AreaSelect>
```

## 属性
### area-select 组件
|  参数  |  类型  |  可选值  |  默认值  |  说明  |
|  :--:  |  :--:  |  :--:  |  :--:  |  :--:  |
| type | String |  all/code/text | code | 设置返回的数据格式 |
| placeholders | Array | - | [] | 设置 placeholder text |
| level | Number | 0/1/2 | 1 | 设置联动层级(0-只选省份/1-省市联动/2-省市区联动) |
| size | String | small/medium/large | medium | 设置输入框的大小 |
| defaultArea | Array | - | [] | 设置默认值(值类型数据需统一，要么全是文本，要么全是区域代码) |
| onChange | Function | - | - | 选择项改变时的回调 |
| disabled | Boolean | - | false | 是否禁用 |
| data | Object | - | - | 地区数据(v3需要传入) |

> v2 仅支持省市区联动，即 v2 不再支持 level 的值为 3

### area-cascader 组件
|  参数  |  类型  |  可选值  |  默认值  |  说明  |
|  :--:  |  :--:  |  :--:  |  :--:  |  :--:  |
| type | String |  all/code/text | code | 设置返回的数据格式 |
| placeholder | String | - | '' | 设置 placeholder text |
| level | Number | 0/1 | 0 | 设置联动层级(0-省市联动/1-省市区联动) |
| size | String | small/medium/large | medium | 设置输入框的大小 |
| defaultArea | Array | - | [] | 设置默认值(值类型数据需统一，要么全是文本，要么全是区域代码) |
| onChange | Function | - | - | 选择项改变时的回调 |
| disabled | Boolean | - | false | 是否禁用 |
| separator | String | - | '/' | 显示选中文本的分隔符 |
| data | Object | - | - | 地区数据(v3需要传入) |

## Related Project
* [vue-area-linkage](https://github.com/dwqs/vue-area-linkage/)

## License
MIT.
