import { DataEvt, EVT } from "./event"
import { StoreMgr } from "./StoreMgr"
import { IPlayerInfo } from "./yang"


export class DataMgr {
    private static _ins: DataMgr

    public static get ins() {
        if(DataMgr._ins == null) {
            DataMgr._ins = new DataMgr()
            DataMgr._ins.init()
        }

        return DataMgr._ins
    }

    private init() {
        this._playerInfo = StoreMgr.ins.getPlayerInfo()
        if(this._playerInfo == null){
            this._playerInfo = {
                power: 50,  //体力
                gold: 30,   //金币
                lastAddPowerTime: 0, //最后加体力的世界搓
                lastLockLevel: 1, //最后解锁的关卡
            }

            StoreMgr.ins.savePlayerInfo(this._playerInfo)
        }

    }

    private _playerInfo: IPlayerInfo


    get gold(): number {
        return this._playerInfo.gold
    }

    private set gold(v: number) {
        this._playerInfo.gold = v 
        StoreMgr.ins.savePlayerInfo(this._playerInfo)
        EVT.emit(DataEvt.CHANGE_GOLD, v)
    }

    addGold(v: number) {
        this.gold += v
    }

    subGold(v: number):boolean{
        if(this.gold >= v){
            this.gold -= v
            return true
        } 

        return false
    }
    get power(): number {
        return this._playerInfo.power
    }

    private set power(v: number) {
        this._playerInfo.power = v
        StoreMgr.ins.savePlayerInfo(this._playerInfo)
        EVT.emit(DataEvt.CHANGE_POWER, v)
    }

    addPower(v: number) {        
        this.power += v
    }

    subPower(v: number): boolean {
        if(this._playerInfo.power >= v) {
            this.power -= v
            return true
        }
        return false
    }

    get lastPowerTime(): number {
        return this._playerInfo.lastAddPowerTime
    }

    set lastPowerTime(val: number) {
        this._playerInfo.lastAddPowerTime = val
        StoreMgr.ins.savePlayerInfo(this._playerInfo)
    }
}