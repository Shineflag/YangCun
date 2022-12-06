import { _decorator, Component, Node, AudioClip, AudioSource, director, tween, Tween } from 'cc';
import { StoreMgr } from './libs/StoreMgr';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    public static ins: AudioManager


    @property(AudioSource)
    bgm: AudioSource

    @property(AudioSource)
    effect: AudioSource

    @property([AudioClip])
    clips: AudioClip[]

    @property(AudioClip)
    gameClip: AudioClip

    @property(AudioClip)
    mainClip: AudioClip

    needEffect: boolean

    onLoad() {
        AudioManager.ins = this
    }
    onEnable() {
        console.log("AudioManager.onEnable")
    }
    onDisable() {
        console.log("AudioManager.onDisable")
        this.stopBgm()
    }
    onDestroy() {
        console.log("AudioManager.onDestroy")
    }
    start() {
        console.log("AudioManager.start")
        this.needEffect = StoreMgr.getSound()
        if(StoreMgr.getMusic()){
            this.playBgm()
        }
    }

    stopBgm() {
        this.bgm.stop()
    }

    setGameBgm(){
        this.stopBgm()
        this.bgm.clip = this.gameClip
        if(StoreMgr.getMusic()) {
            this.playBgm()
        }
    }
    setMainBgm() {
        this.stopBgm()
        this.bgm.clip = this.mainClip
        if(StoreMgr.getMusic()) {
            this.playBgm()
        }
    }

    playBgm() {
        this.bgm.play()
    }

    play(i:number){
        if(!this.needEffect){
            return 
        }

        let clip = this.clips[i]
        if(clip){
            this.effect.playOneShot(clip)
        } else {
            console.log("not found clip", i )
        }

    }
}

