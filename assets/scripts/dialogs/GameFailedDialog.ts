import { _decorator, Component, Node } from 'cc';
import { ItemType } from '../libs/constants';
import { DialogEvt, EVT } from '../libs/event';
import { ViewMgr } from '../views/ViewMgr';
import { DialogMgr } from './DialogMgr';
const { ccclass, property } = _decorator;

@ccclass('GameFailedDialog')
export class GameFailedDialog extends Component {

    @property(Node)
    reliveBtn: Node

    @property(Node)
    backBtn: Node

    start() {

    }

    update(deltaTime: number) {
        
    }

    show() {
        this.node.active = true
        let canRelive = ViewMgr.ins.gameView.tileGame.getItemUseCount(ItemType.RELIVE) > 0 ? false: true
        this.backBtn.active = !canRelive
        this.reliveBtn.active = canRelive
    }

    close() {
        this.node.active = false
        EVT.emit(DialogEvt.CLOSE, this.node.name)
    }

    isShow(): boolean {
        return this.node.active
    }

    onClickRestart() {
        console.log(this.name,"onClickRestart")
        this.close()

        ViewMgr.ins.gameView.reRestart()
    }

    onClickBack() {
        console.log(this.name,"onClickBack")
        this.close()
        DialogMgr.ins.back2LevelView()
    }

    onClickClose() {
        console.log(this.name,"onClickClose")
        this.close()
        DialogMgr.ins.back2LevelView()
    }

    onClickRelive() {
        console.log(this.name,"onClickRestart")
        if(ViewMgr.ins.gameView.reLive()){
            this.close()
        }
    }
}


