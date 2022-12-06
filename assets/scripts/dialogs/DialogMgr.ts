import { _decorator, Component, Node } from 'cc';
import { ViewName } from '../libs/constants';
import { DialogEvt, EVT } from '../libs/event';
import { ViewMgr } from '../views/ViewMgr';
import { IDialog } from './Dialog';
import { GameFailedDialog } from './GameFailedDialog';
import { GamePassDialog } from './GamePassDialog';
import { GamePropsDialog } from './GamePropsDialog';
const { ccclass, property } = _decorator;

@ccclass('DialogMgr')
export class DialogMgr extends Component {

    public static ins: DialogMgr

    bg: Node

    gamePassDialog: GamePassDialog
    gameFailedDialog: GameFailedDialog
    gamePropsDialog: GamePropsDialog

    dialogs: Record<string,IDialog> = {}

    onLoad() {
        DialogMgr.ins = this
        this.bg = this.node.getChildByName("bg")
    }

    onEnable() {
        EVT.on(DialogEvt.CLOSE, this.onDialogClose, this)
    }

    onDisable() {
        EVT.off(DialogEvt.CLOSE, this.onDialogClose, this)
    }

    start() {
        this.initDialogs()
    }

    update(deltaTime: number) {
        
    }

    showDialog(name: string) {      
        console.log("showDialog", name)  
        let find = false
        for( let k in this.dialogs) {
            if(k == name) {
                find = true
                this.dialogs[k].show()
            } else {
                this.dialogs[k].close()
            }
        }
        if(!find){
            console.warn("onfound dialog", name)
            return 
        }
        this.bg.active = true
    }

    initDialogs() {
        this.gameFailedDialog = this.getComponentInChildren(GameFailedDialog)
        this.dialogs["GameFailedDialog"] = this.gameFailedDialog

        this.gamePassDialog = this.getComponentInChildren(GamePassDialog)
        this.dialogs["GamePassDialog"] = this.gamePassDialog

        this.gamePropsDialog = this.getComponentInChildren(GamePropsDialog)
        this.dialogs["GamePropsDialog"] = this.gamePropsDialog

    }

    onDialogClose(name: string){
        console.log("onDialogClose", name)
        this.bg.active = false
    }

    back2LevelView() {
        ViewMgr.ins.showView(ViewName.LevelView)
    }
}


