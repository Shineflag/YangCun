import { _decorator, Component, Node } from 'cc';
import { AudioManager } from '../AudioManager';
import { AClip } from '../libs/constants';
import { ViewMgr } from './ViewMgr';
const { ccclass, property } = _decorator;

@ccclass('HomeView')
export class HomeView extends Component {

    @property(Node)
    setNode: Node

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
        this.setNode.active = false
    }

    //IView
    close() {
        this.node.active = false
    }

    onStartBtnClick() {
        AudioManager.ins.play(AClip.CLICK)
        ViewMgr.ins.showView("LevelView")
    }

    onClickSet() {
        AudioManager.ins.play(AClip.CLICK)
        this.setNode.active = !this.setNode.active
    }
}

