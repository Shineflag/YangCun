
import { EventTarget } from 'cc';
export const  EVT = new EventTarget()

export enum TILE_EVT {
    SELECT = 1, //选择tile
    PASS = 2, //过关
    FAIL= 3, //失败
}

export enum DialogEvt {
    CLOSE = "DialogEvt.CLOSE",
    POWER_CANCEL = "DialogEvt.POWER_CANCEL"
}

export enum ViewEvt {
    LEVEL_SELECT = "ViewEvt.LEVEL_SELECT"
}

export enum DataEvt {
    CHANGE_GOLD = "DataEvt.CHANGE_GOLD",
    CHANGE_POWER = "DataEvt.CHANGE_POWER"
}

export enum PlatformEvt {
    SHARE_APP = "PlatformEvt.SHARE_APP"
}



