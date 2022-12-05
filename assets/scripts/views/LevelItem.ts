import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { LvStatus } from '../libs/constants';
import { Main } from '../Main';
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
        this.lvLabel.string = v.toString()
    }
}

