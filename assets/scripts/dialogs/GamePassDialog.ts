import { _decorator, Component, Node, Label } from 'cc';
import { AudioManager } from '../AudioManager';
import { AClip, ViewName } from '../libs/constants';
import { DialogEvt, EVT } from '../libs/event';
import { Utils } from '../libs/untils';
import { ViewMgr } from '../views/ViewMgr';
import { DialogMgr } from './DialogMgr';
const { ccclass, property } = _decorator;

@ccclass('GamePassDialog')
export class GamePassDialog extends Component {
    @property([Node])
    starsNode: Node[]

    @property(Label)
    passTimeLabel: Label

    @property(Label)
    bestPassTimeLabel: Label

    start() {

    }

    update(deltaTime: number) {
        
    }

    show() {
        this.node.active = true
    }

    close() {
        this.node.active = false
        EVT.emit(DialogEvt.CLOSE, this.node.name)
    }

    isShow(): boolean {
        return this.node.active
    }

    setStar(v: number){
        this.starsNode.forEach( (item, i) => {
            if(i<v){
                item.active = true
            } else {
                item.active = false
            }
        })
    }

    setPassTime(pass: number, best: number){
        this.passTimeLabel.string = `本次用时: ${Utils.formatSecond2MinSec(pass, "分", "秒")}`
        this.bestPassTimeLabel.string = `最佳用时: ${Utils.formatSecond2MinSec(best, "分", "秒")}`
    }

    onClickNext() {
        console.log(this.name,"onClickNext")
        AudioManager.ins.play(AClip.CLICK)
        this.close()

        ViewMgr.ins.gameView.nextLevel()
    }

    onClickBack() {
        // console.log(this.name,"onClickBack")
        AudioManager.ins.play(AClip.CLICK)
        this.close()
        DialogMgr.ins.back2LevelView()
    }

    onClickClose() {
        // console.log(this.name,"onClickClose")
        AudioManager.ins.play(AClip.CLICK)
        this.close()
        DialogMgr.ins.back2LevelView()
    }
}


