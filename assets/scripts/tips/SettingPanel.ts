import { _decorator, Component, Node, Toggle, Input, input, UITransform, EventTouch } from 'cc';
import { AudioManager } from '../AudioManager';
import { AClip, ViewName } from '../libs/constants';
import { EVT, TILE_EVT } from '../libs/event';
import { StoreMgr } from '../libs/StoreMgr';
import { ViewMgr } from '../views/ViewMgr';
const { ccclass, property } = _decorator;

@ccclass('SettingPanel')
export class SettingPanel extends Component {

    @property(Toggle)
    soundToggle: Toggle

    @property(Toggle)
    musicToggle: Toggle

    onEnable() {
        console.log(this.name, "onEnable")
        input.on(Input.EventType.TOUCH_START, this.onInputTouch, this)
        EVT.on(TILE_EVT.SELECT, this.onTileSelect, this)
    } 

    onDisable() {
        console.log(this.name, "onDisable")
        input.off(Input.EventType.TOUCH_START, this.onInputTouch, this)
        EVT.off(TILE_EVT.SELECT, this.onTileSelect, this)
    }
    
    start() {
        this.musicToggle.setIsCheckedWithoutNotify(!StoreMgr.getMusic())
        this.soundToggle.setIsCheckedWithoutNotify(!StoreMgr.getSound())


    }

    update(deltaTime: number) {
        
    }

    onInputTouch(evt: EventTouch ) {
        let rect = this.node.getComponent(UITransform).getBoundingBoxToWorld()
        let p = evt.getLocation()
        // console.log(this.name, "onInputTouch", rect, p, evt.getUILocation())
        if(!rect.contains(p)) {
            this.node.active = false
        }
    }
    onTileSelect() {
        this.node.active = false
    }

    onSoundToggleChange(){
        // console.log("onSoundToggleChange", this.soundToggle.isChecked)
        AudioManager.ins.play(AClip.CLICK)
        let toggle = !this.soundToggle.isChecked
        AudioManager.ins.needEffect = toggle
        StoreMgr.setSound(toggle)
    }

    onMusicToggleChange() {
        // console.log("onMusicToggleChange", this.musicToggle.isChecked)
        AudioManager.ins.play(AClip.CLICK)
        let toggle = !this.musicToggle.isChecked
        StoreMgr.setMusic(toggle)
        if(toggle){
            AudioManager.ins.playBgm()
        } else {
            AudioManager.ins.stopBgm()
        }
    }

    onClickExit() {
        console.log("onClickExit")
        AudioManager.ins.play(AClip.CLICK)
        this.node.active = false
        ViewMgr.ins.showView(ViewName.LevelView)

    }
}


