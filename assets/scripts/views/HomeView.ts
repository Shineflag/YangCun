import { _decorator, Component, Node } from 'cc';
import { ViewMgr } from './ViewMgr';
const { ccclass, property } = _decorator;

@ccclass('HomeView')
export class HomeView extends Component {
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

    onStartBtnClick() {
        ViewMgr.ins.showView("GameView")

        ViewMgr.ins.gameView.startLevel(1)
    }
}

