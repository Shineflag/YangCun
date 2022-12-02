

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

    }

    private _gold: number //金币

    private _power: number //能量

    get gold(): number {
        return this._gold
    }

    private set gold(v: number) {
        this._gold = v 
    }

    addGold(v: number) {
        this.gold -= v
    }

    subGold(v: number):boolean{
        if(this.gold >= v){
            this.gold -= v
            return true
        } 

        return false
    }
    get power(): number {
        return this._power
    }

    private set power(v: number) {
        this._power = v
    }

    addPower(v: number) {
        this.power += v
    }

    subPower(v: number): boolean {
        if(this._power >= v) {
            this.power -= v
            return true
        }

        return false
    }
}