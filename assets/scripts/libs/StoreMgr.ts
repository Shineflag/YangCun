import { Setting } from "./constants"
import { Utils } from "./untils"
import { ILvPlayInfo, IPlayerInfo } from "./yang"


function encode(val: any):string {
    return JSON.stringify(val)
}

function decode(val: string): any{
    return JSON.parse(val)
}

export class LocalStorage {
    //公共
    static set(key: string, val: string){
        localStorage.setItem(key, val)
    }

    static get(k: string): string {
        return localStorage.getItem(k)
    }

    static del(k: string){
        localStorage.removeItem(k)
    }
}

export class StoreMgr {
    private static _ins:StoreMgr

    public static get ins(): StoreMgr {
        if(StoreMgr._ins == null){
            StoreMgr._ins = new StoreMgr()   
        }
        return StoreMgr._ins
    }

    //音频相关
    static setSound(v: boolean){
        if(v){
            LocalStorage.set(Setting.SOUND, "true")
        } else {
            LocalStorage.set(Setting.SOUND, "false")
        }
    }
    
    static getSound(): boolean {
        let value = LocalStorage.get(Setting.SOUND)
        if(value == "false"){
            return false
        }
        return true
    }
    
    static setMusic(v: boolean){
        if(v){
            LocalStorage.set(Setting.MUSIC, "true")
        } else {
            LocalStorage.set(Setting.MUSIC, "false")
        }
    }
    
    static getMusic(): boolean {
        let value = LocalStorage.get(Setting.MUSIC)
        if(value == "false"){
            return false
        }
        return true
    }
    

    //玩家信息
    savePlayerInfo(info: IPlayerInfo) {        
        LocalStorage.set("PLAYER", encode(info))
    }
    getPlayerInfo():IPlayerInfo  {
        let val = LocalStorage.get("PLAYER")
        if(val != ""){
            return decode(val)
        }
        return null
    }



    //闯关信息
    getLvPlayInfo(lv: number): ILvPlayInfo {
        let v = LocalStorage.get(`LV_PLAY_INFO_${lv}`)
        if(v != ""){
            return decode(v)
        }
        return null 
    }

    saveLvPlayInfo( info: ILvPlayInfo) {
        LocalStorage.set(`LV_PLAY_INFO_${info.id}`, encode(info))
    }

    getTodayRewardTimes(): number {
        let key = "TODAY_REWARD_TIMES"
        let day = Utils.getFormatDay()
        let v = LocalStorage.get(key)
        if(v == ""){
            return 0
        }
        let obj = JSON.parse(v)
        if(obj[day]){
            return obj[day]
        }
        return 0
    }
    addTodayRewardTimes() {
        let key = "TODAY_REWARD_TIMES"
        let day = Utils.getFormatDay()
        let v = LocalStorage.get(key)
        let obj = {
            [day] : 1
        }
        if(v != ""){
            let o = JSON.parse(v)
            if(o[day]){
                obj[day] = o[day] + 1
                
            }
        }
        LocalStorage.set(key, JSON.stringify(obj))
    }
}