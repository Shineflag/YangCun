import { _decorator, Component, Node, sys, view, Prefab, SpriteFrame } from 'cc';
import { DEBUG, NET_MODE } from 'cc/env';
import { ResMgr } from './libs/ResMgr';
import { PlatMgr } from './platform/PlatMgr';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    public static ins: Main

    @property(Prefab)
    tilePrefab: Prefab  //tile的prefab

    @property(Prefab)
    lvItemPrefab: Prefab

    @property([SpriteFrame])
    tileSpriteFrames: SpriteFrame[]

    @property([SpriteFrame])
    lvStatusSprame: SpriteFrame[]

    @property([SpriteFrame])
    propsTypeSpriteFrame: SpriteFrame[]


    onLoad() {
        console.log("env:", DEBUG, NET_MODE )
        console.log("sys:", sys.platform )
        if(DEBUG) {
            if(sys.platform == sys.Platform.DESKTOP_BROWSER) {
                view.setResolutionPolicy(3)
            }
        }

        Main.ins = this
    }

    start() {
        PlatMgr.ins.init()
        ResMgr.ins.loadLeveConfig()
        // ResMgr.ins.loadTilesSpriteFrame("tang")
    }

    update(deltaTime: number) {
        
    }

}


