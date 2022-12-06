import { _decorator, Component, Node, Toggle } from 'cc';
import { AudioManager } from '../AudioManager';
import { AClip, ViewName } from '../libs/constants';
import { StoreMgr } from '../libs/StoreMgr';
import { ViewMgr } from '../views/ViewMgr';
const { ccclass, property } = _decorator;

@ccclass('SettingPanel')
export class SettingPanel extends Component {

    @property(Toggle)
    soundToggle: Toggle

    @property(Toggle)
    musicToggle: Toggle
    
    start() {
        this.musicToggle.setIsCheckedWithoutNotify(!StoreMgr.getMusic())
        this.soundToggle.setIsCheckedWithoutNotify(!StoreMgr.getSound())
    }

    update(deltaTime: number) {
        
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


