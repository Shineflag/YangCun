import { EVT, PlatformEvt } from "../libs/event";

const shares = [
    {
        url:'share.png',
        tips:'据说就算爱因斯坦也过不了这一关',
    },
]
export class WxPlatform {

    private static _ins: WxPlatform;
    public wx = window["wx"];

    private _shareAppTime: number = 0
    private _shareTag: string = ""

    static get ins() {
        if (this._ins) {
            return this._ins;
        }
        this._ins = new WxPlatform();
        return this._ins;
    }

    init() {
        //打开菜单分享
        this.wx.showShareMenu();


        if (shares.length > 0) {
            this.wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                let index = Math.floor(Math.random() * shares.length);

                return {
                    title: shares[index].tips,
                    // imageUrlId: shares[index].id, // 图片 id
                    imageUrl: shares[index].url // 图片 URL
                }
            })

            this.wx.onShareTimeline(() => {
                // 用户点击了“转发”按钮
                let index = Math.floor(Math.random() * shares.length);

                return {
                    title: shares[index].tips,
                    // imageUrlId: shares[index].id, // 图片 id
                    imageUrl: shares[index].url // 图片 URL
                }
            })
        }

        this.wx.onShow( res => {
            console.log("wx.onShow",this._shareTag, this._shareAppTime, res)

            if(this._shareAppTime > 0 && this._shareTag != ""){
                const now = Date.now()
                if(now - this._shareAppTime > 1000*3){
                    EVT.emit(PlatformEvt.SHARE_APP, this._shareTag)
                }
            }
            this._shareAppTime = 0
            this._shareTag = ""
        })
    }

    shareAppMsg(tag: string) {
        this._shareAppTime = Date.now()
        this._shareTag = tag
        console.log("shareAppMsg",this._shareTag, this._shareAppTime)
        let index = Math.floor(Math.random() * shares.length);
        this.wx.shareAppMessage({
            title: shares[index].tips,
            // imageUrlId: shares[index].id, // 图片 id
            imageUrl: shares[index].url // 图片 URL
        })
    }


}