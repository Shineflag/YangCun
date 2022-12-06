import { _decorator, Component, Node, dynamicAtlasManager, utils } from 'cc';
import { DialogMgr } from '../dialogs/DialogMgr';
import { GOLD_COST, POWER_COST, TileConfig, ViewName } from '../libs/constants';
import { DataMgr } from '../libs/DataMgr';
import { DataEvt, DialogEvt, EVT, TILE_EVT } from '../libs/event';
import { ResMgr } from '../libs/ResMgr';
import { Utils } from '../libs/untils';
import { AreaConfig, ILvPlayInfo, IPlayerInfo } from '../libs/yang';
import { TipsMgr } from '../tips/TipsMgr';
import { TileGame } from './TileGame';
import { ViewMgr } from './ViewMgr';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {  

    lv: number //当前关卡

    addSlotBtnNode: Node

    tileGame: TileGame

    lvPlayInfo: ILvPlayInfo  //关卡信息

    needPower: number = 0 //需要的能量

    onLoad() {
        console.log("onLoad", this.name) 
        this.tileGame = this.getComponentInChildren(TileGame)
        this.addSlotBtnNode = this.node.getChildByPath("footer/BtnAddSlot")
    }

    onEnable() {
        EVT.on(TILE_EVT.FAIL, this.onGameFailed, this)
        EVT.on(TILE_EVT.PASS, this.onGamePass, this)

    }

    onDisable() {
        EVT.off(TILE_EVT.FAIL, this.onGameFailed, this)
        EVT.off(TILE_EVT.PASS, this.onGamePass, this)
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

    startLevel(lv: number){
        this.lv = lv 
        this.needPower = 0

        //信息统计
        let now = Utils.getUnixTime()
        let playInfo = DataMgr.ins.getLvPlayInfo(lv)
        let needPower = POWER_COST.POWER_AGAIN
        if(playInfo.firstPlay == 0){
            needPower = POWER_COST.POWER_FIRST
            playInfo.firstPlay = now
        }

        //扣除能量
        if(!DataMgr.ins.subPower(needPower)){
            this.needPower = needPower
            EVT.on(DataEvt.CHANGE_POWER,this.needPowerProcess, this)
            EVT.on(DialogEvt.POWER_CANCEL,this.needPowerProcess, this)
            TipsMgr.ins.needPower()
            TipsMgr.ins.showMessage("能量不足")
            return 
        }
        EVT.off(DataEvt.CHANGE_POWER,this.needPowerProcess, this)
        EVT.off(DialogEvt.POWER_CANCEL,this.needPowerProcess, this)
        

        playInfo.lastPlay = now 
        playInfo.playTimes++

        this.lvPlayInfo = playInfo
        DataMgr.ins.changeLvPlayInfo(playInfo)

        let config = this.getLevelConfig(lv)
        console.log("startLevel ", lv, config)

        this.addSlotBtnNode.active = true

        this.tileGame.startGame(config)
    }

    getLevelConfig(lv: number): AreaConfig{
        let config =  ResMgr.ins.getLevelConfig(lv)
        return config 
    }

    onGameFailed() {
        DialogMgr.ins.showDialog("GameFailedDialog")
    }

    nextLevel() {
        this.startLevel(this.lv + 1)
    }

    reRestart() {
        this.startLevel(this.lv)
    }

    //因需要power 而暂停的游戏进程
    needPowerProcess() {
        if(this.needPower == 0){
            return 
        }
        if(DataMgr.ins.power >= this.needPower){
            this.startLevel(this.lv)
        } else {
            ViewMgr.ins.showView(ViewName.HomeView)
        }
    }

    onGamePass() {
        const now = Utils.getUnixTime()
        const passTime = now - this.lvPlayInfo.lastPlay 
        this.lvPlayInfo.passTimes++ 
        let star = 1
        if(this.tileGame.getItemUseCount() == 0) {
            star++
        }
        if( passTime <= 60*1){
            star++
        }
        if(passTime < this.lvPlayInfo.bestTime || this.lvPlayInfo.bestTime == 0){
            this.lvPlayInfo.bestTime = passTime
        }
        if(star > this.lvPlayInfo.star){
            this.lvPlayInfo.star = star
        }
        DataMgr.ins.changeLvPlayInfo(this.lvPlayInfo)

        if(this.lv == DataMgr.ins.lastUnlockLevel){
            DataMgr.ins.lastUnlockLevel++
        }

        DialogMgr.ins.showDialog("GamePassDialog")
        DialogMgr.ins.gamePassDialog.setStar(star)
    }

    onClickRemove() {
        console.log("onClickRemove")
        this.tileGame.useRemove()

    }

    onClickUndo() {
        console.log("onClickRemove")
        this.tileGame.useUndo()
    }

    onClickShuffle() {
        console.log("onClickRemove")
        this.tileGame.useShuffle()
    }

    onClickAddSlot() {
        console.log("onClickAddSlot")
        this.tileGame.useAddSlot()
        this.addSlotBtnNode.active = false
    }


}



