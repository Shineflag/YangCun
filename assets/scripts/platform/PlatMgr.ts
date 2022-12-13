import { sys } from "cc"
import { WECHAT } from "cc/env"
import { WxPlatform } from "./WxPlatform"


export class PlatMgr {
    private  static _ins: PlatMgr
    public static get ins() : PlatMgr {
        if(this._ins == null) {
            this._ins = new PlatMgr
        }
        return this._ins
    }

    init() {
        console.log("sys.platform", sys.platform)
        switch(sys.platform) {
            case sys.Platform.WECHAT_GAME:
                WxPlatform.ins.init()
                break;
        }
    }

    share(tag: string): boolean {
        if(!WECHAT || !window["wx"]){
            console.log(sys.platform,"not support share")
            return false
        }
        WxPlatform.ins.shareAppMsg(tag)
        return true
    }
}