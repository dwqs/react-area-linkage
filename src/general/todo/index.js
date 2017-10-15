/**
 * Created by pomy on 23/07/2017.
 */

import './index.less';

import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer,inject} from 'mobx-react';
import Hello from '@components/hello/index';
@inject('todo')
@observer
export default class ToDo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            val: ''
        }
    }

    valChange = (e) => {
        this.setState({
            val: e.target.value
        })
    }

    addTodo = () => {
        this.props.todo.addToDo(this.state.val);
    }

    deleteToDo = (index) => {
        return () => {
            this.props.todo.deleteToDo(index)
        }
    }

    render(){
        let {list} = this.props.todo;
        list = observable(list).slice();
        return(
            <div className="todo-list">
                <Hello />
                <input type="text" placeholder="输入 todo" value={this.state.val} onChange={this.valChange}/>
                <button className="add" onClick={this.addTodo}>添加</button>
                <ul>
                    {
                        list.length ?
                            list.map((item, index) => {
                                return <li key={index} onClick={this.deleteToDo(index)}>{item}</li>
                            }): null
                    }
                </ul>
            </div>
        )
    }
}
