import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { LvStatus } from '../libs/constants';
import { Main } from '../Main';
import { TipsMgr } from '../tips/TipsMgr';
import { ViewMgr } from './ViewMgr';
const { ccclass, property } = _decorator;

@ccclass('LevelItem')
export class LevelItem extends Component {

    @property(Sprite)
    statusSprite: Sprite


    @property([Node])
    starsNode: Node[]

    @property(Label)
    lvLabel: Label

    @property(Node)
    starRoot: Node

    @property(Node)
    lockRoot: Node

    lv: number

    setStatus(status: LvStatus){
        this.statusSprite.spriteFrame = Main.ins.lvStatusSprame[status]
        let lock = status == LvStatus.Lock
        this.starRoot.active = !lock
        this.lockRoot.active = lock
    } 

    setStars(v: number) {
        this.starsNode.forEach( (item, i) => {
            if(i<v){
                item.active = true
            } else {
                item.active = false
            }
        })
    }

    setLevel(v: number) {
        this.lv = v
        this.lvLabel.string = v.toString()
    }

    onClick() {
        if(this.lockRoot.active){
            console.log("未解锁")
            TipsMgr.ins.showMessage("未解锁,通过前一关将自动解锁")
        }else {
            ViewMgr.ins.startLevel(this.lv)
        }
    }
}

