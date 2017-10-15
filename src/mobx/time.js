/**
 * Created by pomy on 24/07/2017.
 */

import {observable, action} from 'mobx';

class Time {
    @observable
    curTime = 0;

    constructor(time){
        this.curTime = time;
    }

    @action
    getCurTime(){
        this.curTime = Date.now();
    }
}

let time = new Time(Date.now());

export default time;
