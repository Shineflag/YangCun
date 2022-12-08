import { DATE } from "./constants";


export class Utils {

    //获取unix时间戳(秒)
    static getUnixTime(): number {
        return Math.round(Date.now()/ DATE.SECOND)
    }

    //返回类似 09 的格式
    static formatPrefixNum(val: number): string {
        return val > 9 ? val.toString() : `0${val}`
    }

    static formatSecond2MinSec(val: number, minSp:string = ":", secSp: string = "") {
        let min = Math.floor(val/DATE.MIN)
        let sec = val % DATE.MIN
        return `${Utils.formatPrefixNum(min)}${minSp}${Utils.formatPrefixNum(sec)}${secSp}`
    }
}