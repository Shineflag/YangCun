import { _decorator, Component, Node, dynamicAtlasManager, utils, Label } from 'cc';
import { AudioManager } from '../AudioManager';
import { DialogMgr } from '../dialogs/DialogMgr';
import { AClip, GOLD_COST, ItemType, POWER_COST, TileConfig, ViewName } from '../libs/constants';
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

    @property(Label)
    removeGoldLabel: Label

    @property(Label)
    undoGoldLabel: Label

    @property(Label)
    shuffleGoldLabel: Label

    @property(Label)
    lvLabel: Label

    @property(Node)
    setNode: Node

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
        this.setNode.active = false
    }

    //IView
    close() {
        this.node.active = false
    }

    onClickPause() {
        AudioManager.ins.play(AClip.CLICK)
        this.setNode.active = !this.setNode.active
    }

    startLevel(lv: number){
        if(lv > DataMgr.ins.lvCount){
            TipsMgr.ins.showMessage("恭喜全部通关")
            ViewMgr.ins.showView(ViewName.LevelView)
            return 
        }

        this.lv = lv 
        this.needPower = 0
        this.lvLabel.string = `第 ${lv} 关`

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

        this.tileGame.startGame(config)

        this.addSlotBtnNode.active = true
        this.refreshGoldLabel()
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
        if(this.tileGame.getAllItemUseCount() == 0) {
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
        DialogMgr.ins.gamePassDialog.setPassTime(passTime, this.lvPlayInfo.bestTime)
    }

    reLive() {
        let needGold = GOLD_COST.RELIVE
        if(DataMgr.ins.gold < needGold){
            TipsMgr.ins.needGold()
            TipsMgr.ins.showMessage("金币数量不足")
            return false
        } else {
            if(this.tileGame.useRelive()){
                DataMgr.ins.subGold(needGold)
            }

            return true
        }
    }

    onClickRemove() {
        console.log("onClickRemove")   
        AudioManager.ins.play(AClip.CLICK)     
        let needGold = this.useItemNeedGold(ItemType.REMOVE)
        if(DataMgr.ins.gold < needGold){
            TipsMgr.ins.needGold()
            TipsMgr.ins.showMessage("金币数量不足")
        } else {
            if(this.tileGame.useRemove()){
                DataMgr.ins.subGold(needGold)
                this.refreshGoldLabel()
            }
        }

    }

    onClickUndo() {
        console.log("onClickUndo")
        AudioManager.ins.play(AClip.CLICK)
        let needGold = this.useItemNeedGold(ItemType.UNDO)
        if(DataMgr.ins.gold < needGold){
            TipsMgr.ins.needGold()
            TipsMgr.ins.showMessage("金币数量不足")
        } else {
            if(this.tileGame.useUndo()){
                DataMgr.ins.subGold(needGold)
                this.refreshGoldLabel()
            }
        }

    }

    onClickShuffle() {
        console.log("onClickShuffle")
        AudioManager.ins.play(AClip.CLICK)
        let needGold = this.useItemNeedGold(ItemType.SHUFFLE)
        if(DataMgr.ins.gold < needGold){
            TipsMgr.ins.needGold()
            TipsMgr.ins.showMessage("金币数量不足")
        } else {
            if(this.tileGame.useShuffle()){
                DataMgr.ins.subGold(needGold)
                this.refreshGoldLabel()
            }
        }
    }

    onClickAddSlot() {
        console.log("onClickAddSlot")
        AudioManager.ins.play(AClip.CLICK)
        let needGold = GOLD_COST.ADDSLOT
        if(DataMgr.ins.gold < needGold){
            TipsMgr.ins.needGold()
            TipsMgr.ins.showMessage("金币数量不足")
        } else {
            if(this.tileGame.useAddSlot()){
                DataMgr.ins.subGold(needGold)
                this.addSlotBtnNode.active = false
            }
        }
    }

    refreshGoldLabel() {
        this.removeGoldLabel.string = `X ${this.useItemNeedGold(ItemType.REMOVE)}`
        this.undoGoldLabel.string = `X ${this.useItemNeedGold(ItemType.UNDO)}`
        this.shuffleGoldLabel.string = `X ${this.useItemNeedGold(ItemType.SHUFFLE)}`
    }

    useItemNeedGold(t: ItemType): number {
        return GOLD_COST[t] * (this.tileGame.getItemUseCount(t) + 1)
    }


}



