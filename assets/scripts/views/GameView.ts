import { _decorator, Component, Node, dynamicAtlasManager, utils } from 'cc';
import { DialogMgr } from '../dialogs/DialogMgr';
import { ItemGold, TileConfig } from '../libs/constants';
import { DataMgr } from '../libs/DataMgr';
import { EVT, TILE_EVT } from '../libs/event';
import { ResMgr } from '../libs/ResMgr';
import { Utils } from '../libs/untils';
import { AreaConfig, ILvPlayInfo, IPlayerInfo } from '../libs/yang';
import { TileGame } from './TileGame';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {  

    lv: number //当前关卡

    addSlotBtnNode: Node

    tileGame: TileGame

    lvPlayInfo: ILvPlayInfo  //关卡信息

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
        //信息统计
        let playInfo = DataMgr.ins.getLvPlayInfo(lv)
        let now = Utils.getUnixTime()
        playInfo.lastPlay = now 
        playInfo.playTimes++
        if(playInfo.firstPlay == 0){
            playInfo.firstPlay = now
        }
        this.lvPlayInfo = playInfo
        DataMgr.ins.changeLvPlayInfo(playInfo)

        this.lv = lv 
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



