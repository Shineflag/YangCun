import { _decorator, Component, Node } from 'cc';
import { ViewName } from '../libs/constants';
import { DialogEvt, EVT } from '../libs/event';
import { ViewMgr } from '../views/ViewMgr';
import { DialogMgr } from './DialogMgr';
const { ccclass, property } = _decorator;

@ccclass('GamePassDialog')
export class GamePassDialog extends Component {
    @property([Node])
    starsNode: Node[]

    start() {

    }

    update(deltaTime: number) {
        
    }

    show() {
        this.node.active = true
    }

    close() {
        this.node.active = false
        EVT.emit(DialogEvt.CLOSE, this.node.name)
    }

    setStar(v: number){
        this.starsNode.forEach( (item, i) => {
            if(i<v){
                item.active = true
            } else {
                item.active = false
            }
        })
    }


    onClickNext() {
        console.log(this.name,"onClickNext")
        this.close()

        ViewMgr.ins.gameView.nextLevel()
    }

    onClickBack() {
        console.log(this.name,"onClickBack")
        this.close()
        DialogMgr.ins.back2LevelView()
    }

    onClickClose() {
        console.log(this.name,"onClickClose")
        this.close()
        DialogMgr.ins.back2LevelView()
    }
}


