import { AssetManager, assetManager,JsonAsset, Prefab, SpriteFrame } from "cc";
import { AreaConfig } from "./yang";


export class ResMgr {

    private static _ins: ResMgr
    public static get ins():ResMgr {
        if(!this._ins) {
            this._ins = new ResMgr()
        }
        return this._ins
    }


    private _tiles: Record<string, SpriteFrame[]> = {}

    private _lvConfigs: Record<string, AreaConfig> = {}



    //关卡数据
    public loadLeveConfig() {
        assetManager.loadBundle("GuanQa", (err, bundle) => {
            bundle.loadDir<JsonAsset>('json/levels', (err, res: JsonAsset[]) => {
                console.log("err", err)
                res.forEach( item => {
                    this._lvConfigs[item.name] = item.json as AreaConfig
                })
            } )
        })
    }

    public  getLevelConfig(lv: number): AreaConfig{
        return this._lvConfigs[lv.toString()]
    }


    //获取tiles spriteframe
    public loadTilesSpriteFrame(name: string) {
        assetManager.loadBundle("Tiles", (err: Error, bundle: AssetManager.Bundle) => {
            if(err != null) {
                console.log(`load bundle Tiles err:`, err)
            } else {
                bundle.loadDir(name, SpriteFrame, (err: Error, assets: SpriteFrame[]) => {
                    // this._tiles[name] = assets
                    console.log("yang tiles lenght", assets.length)
                    this._tiles[name] = []
                    assets.forEach( sp => {
                        this._tiles[name].push(sp)
                    })
                })
            }
        })
    }

    public getTileSpriteFrame(val: number, name: string = "yang"):SpriteFrame{
        if(this._tiles[name]){
            return this._tiles[name][val]
        }
        console.log("getTileSpriteFrame null", name, val)
        return null 
    }
}