import { _decorator, Component, Node, Label, macro } from 'cc';
import { DataConfig, DATE } from '../libs/constants';
import { DataMgr } from '../libs/DataMgr';
import { DataEvt, EVT } from '../libs/event';
import { Utils } from '../libs/untils';
const { ccclass, property } = _decorator;

@ccclass('TipsMgr')
export class TipsMgr extends Component {

    @property(Label)
    powerLabel: Label

    @property(Label)
    goldLabel: Label

    @property(Label) 
    powerTimeLabel: Label


    addPowerTime: number = 0

    

    start() {
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
        this.addADPower()
    }

    onClickAddGold() {
        this.addADGold()
    }

    //看广告得能量
    addADPower() {
        DataMgr.ins.addPower(25)
    }

    addADGold(){
        DataMgr.ins.addGold(30)
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

}


