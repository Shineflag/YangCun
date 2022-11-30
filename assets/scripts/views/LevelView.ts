import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelView')
export class LevelView extends Component {
    onLoad() {
        console.log("onLoad", this.name) 
    }


    start() {

    }

    update(deltaTime: number) {
        
    }

    //IView
    show() {
        this.node.active = true
    }

    //IView
    close() {
        this.node.active = false
    }
}


