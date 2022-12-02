
import { EventTarget } from 'cc';
export const  EVT = new EventTarget()

export enum TILE_EVT {
    SELECT = 1, //选择tile
    PASS = 2, //过关
    FAIL= 3, //失败
}

export enum DialogEvt {
    CLOSE = "CLOSE"
}



