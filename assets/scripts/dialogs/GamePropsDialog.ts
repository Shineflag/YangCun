import { _decorator, Component, Node, Sprite, Label } from 'cc';
import { AudioManager } from '../AudioManager';
import { AClip, PropsType } from '../libs/constants';
import { DialogEvt, EVT } from '../libs/event';
import { Main } from '../Main';
import { TipsMgr } from '../tips/TipsMgr';
const { ccclass, property } = _decorator;

@ccclass('GamePropsDialog')
export class GamePropsDialog extends Component {

    @property(Sprite)
    iconSprite: Sprite

    @property(Label)
    numLabel: Label

    @property(Label)
    titleLabel: Label

    propsType: PropsType
    num: number

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

    setType(t: PropsType){
        this.propsType = t 
        this.iconSprite.spriteFrame = Main.ins.propsTypeSpriteFrame[t]

        
        switch(this.propsType){
            case PropsType.GOLD:
                this.titleLabel.string = "获取金币"
                break 
            case PropsType.POWER:
                this.titleLabel.string = "获取能量"
                break;
            default: 
                console.log("unknow props type", this.propsType)
        }
    }
    setNum(v: number) {
        this.num = v 
        this.numLabel.string = `+${v}`
    }

    onClickOK() {
        console.log(this.name,"onClickOK")
        AudioManager.ins.play(AClip.CLICK)
        this.close()

        switch(this.propsType){
            case PropsType.GOLD:
                TipsMgr.ins.addADGold()
                break 
            case PropsType.POWER:
                TipsMgr.ins.addADPower()
                break;
            default: 
                console.log("unknow props type", this.propsType)
        }
    }

    onClickBack() {
        console.log(this.name,"onClickBack")
        AudioManager.ins.play(AClip.CLICK)
        this.close()

        if(this.propsType == PropsType.POWER){
            EVT.emit(DialogEvt.POWER_CANCEL)
        }
    }

    onClickClose() {
        console.log(this.name,"onClickClose")
        AudioManager.ins.play(AClip.CLICK)
        this.close()
        if(this.propsType == PropsType.POWER){
            EVT.emit(DialogEvt.POWER_CANCEL)
        }

    }
}


