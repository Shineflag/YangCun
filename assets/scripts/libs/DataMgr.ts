import { DataEvt, EVT } from "./event"
import { StoreMgr } from "./StoreMgr"
import { ILvPlayInfo, IlvPropInfo, IPlayerInfo } from "./yang"


const LV_COUNT = 9

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
                power: 30,  //体力
                gold: 30,   //金币
                lastAddPowerTime: 0, //最后加体力的世界搓
                lastUnLockLevel: 1, //最后解锁的关卡
            }

            StoreMgr.ins.savePlayerInfo(this._playerInfo)
        }

    }

    private _playerInfo: IPlayerInfo
    private _lvPlayInfo: Map<number, ILvPlayInfo> = new Map<number, ILvPlayInfo>()


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

    get lastUnlockLevel() {
        return this._playerInfo.lastUnLockLevel
    }

    set lastUnlockLevel(v: number) {
        this._playerInfo.lastUnLockLevel = v 
        StoreMgr.ins.savePlayerInfo(this._playerInfo)
    }

    //总关卡数
    get lvCount(): number {
        return LV_COUNT
    }

    getLvPlayInfo(lv: number): ILvPlayInfo{
        if(!this._lvPlayInfo.has(lv)){
            let info = StoreMgr.ins.getLvPlayInfo(lv)
            if(info == null) {
                info = {
                    id: lv,  //关卡id
                    firstPlay: 0, //第一次玩的时间戳
                    lastPlay: 0,  //最后一次玩的时间
                    playTimes: 0, //玩了几次
                    passTimes: 0, //过关几次
                    bestTime:0,   //最佳过关时间(秒)
                    star: 0,      //最佳成绩几颗星 
                }
                StoreMgr.ins.saveLvPlayInfo( info)
            }
            this._lvPlayInfo.set(lv, info)
        }
        return this._lvPlayInfo.get(lv)
    }

    changeLvPlayInfo(info: ILvPlayInfo) {
        this._lvPlayInfo.set(info.id, info)
        StoreMgr.ins.saveLvPlayInfo( info)
    }



}