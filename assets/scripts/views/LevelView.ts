import { _decorator, Component, Node, instantiate, Prefab } from 'cc';
import { AudioManager } from '../AudioManager';
import { AClip, LvStatus } from '../libs/constants';
import { DataMgr } from '../libs/DataMgr';
import { Main } from '../Main';
import { LevelItem } from './LevelItem';
import { ViewMgr } from './ViewMgr';
const { ccclass, property } = _decorator;

@ccclass('LevelView')
export class LevelView extends Component {

    @property(Node)
    listNode: Node

    @property(Prefab)
    awaitPrefab: Prefab


    levelMap: Map<number, LevelItem> = new Map<number, LevelItem>()

    onLoad() {
        console.log("onLoad", this.name) 
        this.initList()
    }

    onEnable() {
        this.refreshList()
    }


    start() {
        
    }

    update(deltaTime: number) {
        
    }

    initList() {
        //create lvitem 
        for(let i = 1; i <= DataMgr.ins.lvCount; i++){
            let item = instantiate(Main.ins.lvItemPrefab)
            let li = item.getComponent(LevelItem)
            li.setLevel(i)
            this.levelMap.set(i, li)
            this.listNode.addChild(item)
        }
        let awaitNode = instantiate(this.awaitPrefab)
        this.listNode.addChild(awaitNode)


    }

    refreshList() {
        for(let i = 1; i < DataMgr.ins.lastUnlockLevel; i++) {
            let data = DataMgr.ins.getLvPlayInfo(i)
            let item = this.levelMap.get(i)
            item.setStatus(LvStatus.Pass)
            item.setStars(data.star)
        }

        if(this.levelMap.has(DataMgr.ins.lastUnlockLevel)) {
            console.log("unlock", DataMgr.ins.lastUnlockLevel)
            this.levelMap.get(DataMgr.ins.lastUnlockLevel).setStatus(LvStatus.Unlock)
        }
    }

    //IView
    show() {
        this.node.active = true
    }

    //IView
    close() {
        this.node.active = false
    }

    onClickBack() {
        AudioManager.ins.play(AClip.CLICK)
        ViewMgr.ins.showView("HomeView")
    }
}


