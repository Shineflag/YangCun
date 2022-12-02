import { _decorator, Component, Node, dynamicAtlasManager } from 'cc';
import { DialogMgr } from '../dialogs/DialogMgr';
import { ItemGold, TileConfig } from '../libs/constants';
import { EVT, TILE_EVT } from '../libs/event';
import { ResMgr } from '../libs/ResMgr';
import { AreaConfig } from '../libs/yang';
import { TileGame } from './TileGame';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {  

    lv: number //当前关卡

    tileGame: TileGame

    onLoad() {
        console.log("onLoad", this.name) 
        this.tileGame = this.getComponentInChildren(TileGame)
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
        let config = this.getLevelConfig(lv)
        console.log("startLevel ", lv, config)

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
        DialogMgr.ins.showDialog("GamePassDialog")
    }

    onClickRemove() {
        console.log("onClickRemove")

    }

    onClickUndo() {
        console.log("onClickRemove")
    }

    onClickShuffle() {
        console.log("onClickRemove")
    }

    onClickAddShuffle() {
        console.log("onClickRemove")
    }


}



