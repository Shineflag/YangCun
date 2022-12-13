import { _decorator, Component, Node, Label, macro, tween, Vec3, Tween } from 'cc';
import { AudioManager } from '../AudioManager';
import { DialogMgr } from '../dialogs/DialogMgr';
import { AClip, DataConfig, DATE, PropsType } from '../libs/constants';
import { DataMgr } from '../libs/DataMgr';
import { DataEvt, EVT, PlatformEvt } from '../libs/event';
import { Utils } from '../libs/untils';
import { PlatMgr } from '../platform/PlatMgr';
const { ccclass, property } = _decorator;

const AD_POWER = 20 
const AD_GOLD = 30

const MAX_REWARD_TIMES = 5 //每天最大领奖次数

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
        EVT.on(PlatformEvt.SHARE_APP, this.onShareCallBack, this)

        this.onGoldChange(DataMgr.ins.gold)
        this.onPowerChange(DataMgr.ins.power)
    }

    onClickAddPower() {
        AudioManager.ins.play(AClip.CLICK)
        this.needPower()
    }

    needPower() {
        DialogMgr.ins.addShowDialog("GamePropsDialog")
        DialogMgr.ins.gamePropsDialog.setType(PropsType.POWER)
        DialogMgr.ins.gamePropsDialog.setNum(AD_POWER)
    }

    onClickAddGold() {
        AudioManager.ins.play(AClip.CLICK)
        this.needGold()
    }

    needGold() {
        DialogMgr.ins.addShowDialog("GamePropsDialog")
        DialogMgr.ins.gamePropsDialog.setType(PropsType.GOLD)
        DialogMgr.ins.gamePropsDialog.setNum(AD_GOLD)
    }

    //看广告得能量
    addADPower() {
        if(PlatMgr.ins.share(DataEvt.CHANGE_POWER)){
            // DataMgr.ins.addPower(AD_POWER)
        }else {
            this.showMessage("该平台暂不支持")
        }

    }

    addADGold(){
        if(PlatMgr.ins.share(DataEvt.CHANGE_GOLD)){
            // DataMgr.ins.addGold(AD_GOLD)
        }else {
            this.showMessage("该平台暂不支持")
        }
    }

    onShareCallBack(tp: string){
        console.log("onShareCallBack", tp, DataMgr.ins.rewardTimes)
        if(DataMgr.ins.rewardTimes <= MAX_REWARD_TIMES){
            DataMgr.ins.addRewardTimes()
        }else {
            this.showMessage("今日领奖次数已达上限")
            return
        }
        switch(tp){
            case DataEvt.CHANGE_GOLD:
                DataMgr.ins.addGold(AD_GOLD)
                break;
            case DataEvt.CHANGE_POWER:
                DataMgr.ins.addPower(AD_POWER)
                break
        }
    }

    onPowerChange(val: number) {
        this.powerLabel.string = val.toString()
        if(val < DataConfig.MAX_POWER ) {
            if(this.addPowerTime == 0) {
                const now = Utils.getUnixTime() 
                this.addPowerTime = now 
                DataMgr.ins.lastPowerTime = now 
            }
            this.powerTimeLabel.node.active = true
        } else {
            this.addPowerTime = 0
            DataMgr.ins.lastPowerTime = 0
            this.powerTimeLabel.node.active = false
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
                this.addPowerTime = now
                DataMgr.ins.lastPowerTime = now 

                let power = Math.floor(pass/DataConfig.ADD_POWER_TIME)
                if(DataMgr.ins.power   + power > DataConfig.MAX_POWER){
                    power = DataConfig.MAX_POWER - DataMgr.ins.power 
                }
                if(power > 0) {
                    DataMgr.ins.addPower(power)
                }
                pass = pass % DataConfig.ADD_POWER_TIME
            }

            let left = DataConfig.ADD_POWER_TIME - pass
            this.powerTimeLabel.string = Utils.formatSecond2MinSec(left)
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


