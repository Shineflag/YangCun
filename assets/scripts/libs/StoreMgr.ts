import { IPlayerInfo } from "./yang"


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
}