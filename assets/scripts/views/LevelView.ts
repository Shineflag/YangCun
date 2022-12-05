import { _decorator, Component, Node, instantiate } from 'cc';
import { LvStatus } from '../libs/constants';
import { DataMgr } from '../libs/DataMgr';
import { Main } from '../Main';
import { LevelItem } from './LevelItem';
const { ccclass, property } = _decorator;

@ccclass('LevelView')
export class LevelView extends Component {

    @property(Node)
    listNode: Node


    levelMap: Map<number, LevelItem> = new Map<number, LevelItem>()

    onLoad() {
        console.log("onLoad", this.name) 
    }


    start() {
        this.initList()
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

        for(let i = 1; i < DataMgr.ins.lastUnlockLevel; i++) {
            let data = DataMgr.ins.levelPlayInfo(i)
            let item = this.levelMap.get(i)
            item.setStatus(LvStatus.Pass)
            item.setStars(data.star)
        }

        if(this.levelMap.has(DataMgr.ins.lastUnlockLevel)) {
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
}


