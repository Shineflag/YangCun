import { _decorator, Component, Node } from 'cc';
import { TileConfig } from '../libs/constants';
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


}



