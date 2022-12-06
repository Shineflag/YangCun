import { _decorator, Component, Node, Label, macro, tween, Vec3, Tween } from 'cc';
import { DialogMgr } from '../dialogs/DialogMgr';
import { DataConfig, DATE, PropsType } from '../libs/constants';
import { DataMgr } from '../libs/DataMgr';
import { DataEvt, EVT } from '../libs/event';
import { Utils } from '../libs/untils';
const { ccclass, property } = _decorator;

const AD_POWER = 25 
const AD_GOLD = 30

@ccclass('TipsMgr')
export class TipsMgr extends Component {

    public static ins: TipsMgr

    @property(Label)
    powerLabel: Label

    @property(Label)
    goldLabel: Label

    @property(Label) 
    powerTimeLabel: Label

    @property(Node)
    msgNode: Node

    @property(Label)
    msgLabel: Label


    addPowerTime: number = 0

    

    start() {
        TipsMgr.ins = this 

        this.addPowerTime = DataMgr.ins.lastPowerTime
        this.schedule(() => {
            this.changePowerTime()
        }, 1,macro.REPEAT_FOREVER)

        EVT.on(DataEvt.CHANGE_GOLD,this.onGoldChange, this)
        EVT.on(DataEvt.CHANGE_POWER,this.onPowerChange, this)

        this.onGoldChange(DataMgr.ins.gold)
        this.onPowerChange(DataMgr.ins.power)
    }

    update(dt: number) {


    }


    onClickAddPower() {
        this.needPower()
    }

    needPower() {
        DialogMgr.ins.addShowDialog("GamePropsDialog")
        DialogMgr.ins.gamePropsDialog.setType(PropsType.POWER)
        DialogMgr.ins.gamePropsDialog.setNum(AD_POWER)
    }

    onClickAddGold() {
        this.needGold()
    }

    needGold() {
        DialogMgr.ins.addShowDialog("GamePropsDialog")
        DialogMgr.ins.gamePropsDialog.setType(PropsType.GOLD)
        DialogMgr.ins.gamePropsDialog.setNum(AD_GOLD)
    }

    //看广告得能量
    addADPower() {
        DataMgr.ins.addPower(AD_POWER)
    }

    addADGold(){
        DataMgr.ins.addGold(AD_GOLD)
    }

    onPowerChange(val: number) {
        this.powerLabel.string = val.toString()
        if(val < DataConfig.MAX_POWER ) {
            if(this.addPowerTime == 0) {
                this.addPowerTime = Utils.getUnixTime() 
            }
        } else {
            this.addPowerTime = 0
        }
    }

    onGoldChange(val: number){
        this.goldLabel.string = val.toString()
    }

    changePowerTime() {
        if(this.addPowerTime > 0 ){  
            let now =  Utils.getUnixTime()      
            let pass =   now - this.addPowerTime 
            if(pass >= DataConfig.ADD_POWER_TIME) {
                let power = Math.floor(pass/DataConfig.ADD_POWER_TIME)
                DataMgr.ins.addPower(power)
                this.addPowerTime = now
                DataMgr.ins.lastPowerTime = now 

                pass = pass % DataConfig.ADD_POWER_TIME
            }

            let left = DataConfig.ADD_POWER_TIME - pass
            this.powerTimeLabel.string = Utils.formatSecond2MinSec(left)
      
            this.powerTimeLabel.node.active = true
        } else {
            this.powerTimeLabel.node.active = false
        }
    }

    showMessage(v: string){
        this.msgNode.active = true        
        this.msgLabel.string = v
        this.msgNode.setPosition(720, 0)
        Tween.stopAllByTarget(this.msgNode.position)
        tween(this.msgNode.position)
        .to(0.25, new Vec3(0, 0, 0), {
            onUpdate: (target: Vec3) => {
                this.msgNode.setPosition(target.x, target.y)
            }
        })
        .delay(0.8)
        .to(0.25, new Vec3(-720, 0, 0), {
            onUpdate: (target: Vec3) => {
                this.msgNode.setPosition(target.x, target.y)
            }
        })
        .call( () => {
            this.msgNode.active = false
        })
        .start()
    }

}


