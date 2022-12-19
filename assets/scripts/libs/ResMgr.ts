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

    private _lvConfigs: Map<string, AreaConfig> = new Map<string, AreaConfig>()

    private _lvLoadOver: boolean = false

    //关卡数据
    public loadLeveConfig() {
        assetManager.loadBundle("GuanQa", (err, bundle) => {
            bundle.loadDir<JsonAsset>('json/levels', (err, res: JsonAsset[]) => {
                console.log("err", err)
                res.forEach( item => {
                    this._lvConfigs.set(item.name,item.json as AreaConfig)
                })
                this._lvLoadOver = true
            } )
        })
    }

    get lvLoadOK(): boolean {
        return this._lvLoadOver
    }

    get lvCount(){
        return this._lvConfigs.size
    }

    public  getLevelConfig(lv: number): AreaConfig{
        return this._lvConfigs.get(lv.toString())
    }


    //获取tiles spriteframe
    public loadTilesSpriteFrame(name: string) {
        assetManager.loadBundle("Tiles", (err: Error, bundle: AssetManager.Bundle) => {
            if(err != null) {
                console.log(`load bundle Tiles err:`, err)
            } else {
                bundle.loadDir(name, SpriteFrame, (err: Error, assets: SpriteFrame[]) => {
                    // this._tiles[name] = assets
                    if(err != null){
                        console.error(`load ${name} err:` , err)
                        return 
                    }
                    console.log("yang tiles lenght", assets.length)
                    this._tiles[name] = []
                    assets.forEach( sp => {
                        this._tiles[name].push(sp)
                    })
                })
            }
        })
    }

    public getTileSpriteFrame(val: number, name: string = "tang"):SpriteFrame{
        if(this._tiles[name]){
            return this._tiles[name][val]
        }
        console.log("getTileSpriteFrame null", name, val)
        return null 
    }
}