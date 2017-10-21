# react-area-linkage
省市区联动选择，基于 Ant Design. 组合数据来源：[area-data](https://github.com/dwqs/area-data)

## Installation
Install the pkg with npm:
```
npm i --save react-area-linkage
```
or yarn
```
yarn add  react-area-linkage
```

## Usage
```
import React from 'react';
import { AreaSelect, AreaCascader } from 'react-area-linkage';

// basic
<AreaSelect onChange={this.selectedChange} />
<AreaCascader onChange={this.selectedChange} />

//setting
<AreaSelect type='all' level={2} onChange={this.selectedChange} />
<AreaCascader type='all' onChange={this.selectedChange} level={2} />
```

More demo to visit [here](https://dwqs.github.io/react-area-linkage/).

## License
MIT.
