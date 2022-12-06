import { _decorator, Component, Node, math, instantiate } from "cc";
import { ItemType, TileAnimTime, TileConfig, TILE_ZONE } from "../libs/constants";
import { EVT, TILE_EVT } from "../libs/event";
import { Tile } from "../libs/Tile";
import { AreaConfig } from "../libs/yang";
import { Main } from "../Main";
const { ccclass, property } = _decorator;

const NormalListMaxLen = 7

@ccclass("TileGame")
export class TileGame extends Component {
    areaStartX: number; //方块区的起始位置X
    areaStartY: number; //方块区的起始位置Y

    listStartX: number; //消除槽的起始位置
    listStartY: number; //消除槽的起始位置

    stackStartX: number; //移除槽的起始位置
    stackStartY: number; //移除槽的起始位置


    layerTiles: Set<Tile>[] = [] //所有的方块 按层堆放
    stackLayer: Map<number,Tile>[] = []  //堆的方块(道具移动放置)

    listTiles: Tile[] = []  //消除列表
    listMaxLen: number //消除列表的最大长度

    total: number = 0; //总tile个数
    leftCount: number = 0; //剩余个数

    itemUse: Record<string, number> = {}

    area: Node

    onLoad() {
        console.log("onLoad", this.name);

        let tilesNode = this.node.getChildByName("tiles");
        this.areaStartX = tilesNode.position.x;
        this.areaStartY = tilesNode.position.y;
        console.log("area start ",this.areaStartX, this.areaStartY)

        let listNode = this.node.getChildByName("list");
        this.listStartX = listNode.position.x;
        this.listStartY = listNode.position.y;

        let stackNode = this.node.getChildByName("stack");
        this.stackStartX = stackNode.position.x;
        this.stackStartY = stackNode.position.y;

        this.area = this.node.getChildByName("area")
        console.log("list start ",this.listStartX, this.listStartY)
    }

    onEnable() {
        EVT.on(TILE_EVT.SELECT, this.onTileSelect, this)

    }

    onDisable() {
        EVT.off(TILE_EVT.SELECT, this.onTileSelect, this)

    }

    start() {

    }

    update(deltaTime: number) { }

    gameReset() {
        this.listMaxLen = NormalListMaxLen

        //清理tiles
        this.layerTiles.forEach( layer => {
            if(layer.size > 0){
                layer.forEach( tile => {
                    tile.delete()
                })
                layer.clear()
            }
        })
        this.layerTiles = []

        this.stackLayer.forEach( layer => {
            if(layer.size > 0){
                layer.forEach( tile => {
                    tile.delete()
                })
                layer.clear()
            }
        })
        this.stackLayer = []



        this.listTiles.forEach( tile => {
            tile.delete()
        })
        this.listTiles = []

        //道具使用情况
        for(let k in ItemType){
            this.itemUse[k] = 0
        }
    }

    startGame(config: AreaConfig) {
        this.gameReset()

        //tile 的总数
        let total = 0;
        config.layers.forEach((arr) => {
            total += arr.x.length;
        });
        let vals = this.generateTileVals(total, config.count);

        this.total = vals.length;
        this.leftCount = this.total;

        console.log("vals length", vals.length, total, vals);
        for (let i = 0; i < config.layers.length; i++) {
            let layer = config.layers[i];
            for (let j = 0; j < layer.x.length; j++) {
                let val = vals.pop();
                if (val === undefined) {
                    console.warn("not tile", i, j, vals);
                    break;
                } else {
                    let tile = this.creatTile(val);
                    this.addAreaTile(tile, layer.x[j], layer.y[j], i);
                }
            }
        }
    }

    //
    generateTileVals(total: number, count: number): number[] {
        //生成几组图案
        let group = Math.floor(total / 3);
        let types: number[] = [];

        //当配置图案种类小于图案组数
        if (count > group) {
            count = group;
        }
        for (let i = 0; i < count; i++) {
            types.push(i, i, i);
            group--;
        }
        while (group > 0) {
            let tp = math.randomRangeInt(0, count);
            types.push(tp, tp, tp);
            group--;
        }

        //洗牌
        let len = types.length;
        for (let i = 0; i < len; i++) {
            let index = math.randomRangeInt(0, len);
            if (index != i) {
                let tmp = types[i];
                types[i] = types[index];
                types[index] = tmp;
            }
        }

        return types;
    }

    creatTile(val:number): Tile{
        let pf = instantiate(Main.ins.tilePrefab)
        let tile = pf.getComponent(Tile)
        tile.setVal(val)
        tile.setFace(Main.ins.tileSpriteFrames[val])

        return tile
    }

    //undo操作回来
    putAreaTile(tile: Tile) {
        tile.setAreaIndex(tile.x, tile.y, tile.z)
        let layer = this.layerTiles[tile.z]
        layer.add(tile)

        let z = tile.z 
        if(z > 0) {
            for(let zindex = z-1; zindex >=0; zindex --){
                const bottomLayer = this.layerTiles[zindex]
                bottomLayer.forEach( blowTile => {
                    if(this.isOverlap(tile, blowTile)) {
                        tile.addBottomTile(blowTile)
                        blowTile.addTopTile(tile)
                    }
                })
            }

        }
        tile.changePositon(this.getAreaPosX(tile.x), this.getAreaPosY(tile.y))
    }

    addAreaTile(tile: Tile, x:number, y: number, z:number) {
        tile.node.setParent(this.area)
        tile.setAreaIndex(x,y, z)
        tile.setPosition( this.getAreaPosX(x), this.getAreaPosY(y))

        let record = this.layerTiles[z] 
        if(!record){
            record = new Set<Tile>()
            this.layerTiles[z] = record
        }
        record.add(tile)
        if(z > 0) {
            for(let zindex = z-1; zindex >=0; zindex --){
                const bottomLayer = this.layerTiles[zindex]
                bottomLayer.forEach( blowTile => {
                    if(this.isOverlap(tile, blowTile)) {
                        tile.addBottomTile(blowTile)
                        blowTile.addTopTile(tile)
                    }
                })
            }

        }
    }

    //undo操作回来
    putStackTile(tile: Tile) {

        let layer = this.stackLayer[tile.z]
        layer.set(tile.x, tile)
        tile.setStackIndex(tile.x, tile.z)

        let z = tile.z 
        const mod = z % 2 
        if(z > 0) {
            for(let zIndex = z-1; zIndex >=0; zIndex--){
                const bottomLayer = this.stackLayer[zIndex]
                // console.log("bottomLayer", bottomLayer)
                if(bottomLayer.has(tile.x)){
                    let blowTile = bottomLayer.get(tile.x)
                    tile.addBottomTile(blowTile)
                    blowTile.addTopTile(tile)
                }
                const zMod = zIndex % 2
                if(mod != zMod){
                    let delta = (mod == 0) ? -1 : 1
                    let index = tile.x + delta
                    console.log("putStackTile ", tile.x, tile.z, index)
                    if(bottomLayer.has(index)){
                        let blowTile = bottomLayer.get(index)
                        tile.addBottomTile(blowTile)
                        blowTile.addTopTile(tile)
                    }
                }
    
            }
        }
        tile.changePositon(this.getStackPosX(tile.x, z), this.stackStartY)
    }

    addStackTile(tile: Tile) {
        let z = -1
        if(this.stackLayer.length > 0) {
            let lastIndex = this.stackLayer.length-1
            if(this.stackLayer[lastIndex].size < this.getStackLayerMaxCount(lastIndex))
            z = lastIndex
        } 

        //没有找到，新建一层
        if(z == -1){
            this.stackLayer.push(new Map<number, Tile>)
            z = this.stackLayer.length - 1
        }
        let layer = this.stackLayer[z]
        let x = -1 
        const maxCount = this.getStackLayerMaxCount(z)
        for(let k = 0; k < maxCount; k++){
            if(!layer.has(k)){
                x = k 
                break
            }
        }

        tile.setStackIndex(x, z)
        this.putStackTile(tile)
    }
    
    //
    getStackLayerMaxCount(z: number) {
        if(z % 2 == 0){
            return TileConfig.STACK_TILE
        } else {
            return TileConfig.STACK_TILE - 1
        }
    }

    onTileSelect(tile: Tile) {
        switch (tile.zone) {
            case TILE_ZONE.AREA:
                this.selectAreaTile(tile)
                break 
            case TILE_ZONE.STACK:
                this.selectStackTile(tile)
                break 
            default:
                console.error("onTileSelect unknow tile", tile)
        }
    }

    selectAreaTile(tile: Tile){
        let layer = this.layerTiles[tile.z]
        if(layer.has(tile)){
            //
            layer.delete(tile)

            //让下面的方格移除top
            tile.bottomTiels.forEach( item => {
                item.topTiles.delete(tile)
            })
    

            // tile.setBaseScale()
            this.add2List(tile)
        }
    }

    selectStackTile(tile: Tile) {
        console.log("selectStackTile")
        let layer = this.stackLayer[tile.z]
        if(layer.has(tile.x)){
            //
            layer.delete(tile.x)

            //让下面的方格移除top
            tile.bottomTiels.forEach( item => {
                item.topTiles.delete(tile)
            })

            this.add2List(tile)
        }  else {
            console.error("not found layer tile", layer)
        }
    }

    add2List(tile: Tile) {
        tile.toListZone()

        let index = -1  //加入后在消除列表中的下标
        let count = 0
        for(let i = 0; i < this.listTiles.length; i++) {
            if(this.listTiles[i].val == tile.val){
                count++
                index = i
            }
        }


        if(index != -1){
            this.listTiles.splice(index,0,tile)
            index = index + 1

        } else {
            this.listTiles.push(tile)
            index = this.listTiles.length - 1
        }

        let x = this.getListPosX(index)

        tile.changePositon(x,this.listStartY)

        if(count > 0) {
            //后面的方块移动一个方块的位置
            if(index < this.listTiles.length -1){
                this.moveListTilePos(index + 1)
            }

            //三消
            if(count == 2) { 

                let erase =  this.listTiles.splice(index-count, 3)
                this.leftCount -= 3
                console.log("leftCount",this.leftCount)

                this.scheduleOnce( () => {
                    // Global.am.play(AClip.THREE)
                    erase.forEach( item => item.erase())

                    //三消后面的图案
                    let needMoveIndex = index - count
                    if(needMoveIndex < this.listTiles.length ) {
                        this.moveListTilePos(needMoveIndex)
                    }


                    if(this.leftCount <= 0) {
                        this.scheduleOnce(() => {
                            this.gamePass()
                        }, 0.1)
                    }
                    
                }, TileAnimTime.MOVE)       
            }
        }
        if(this.listTiles.length >= this.listMaxLen){
            this.gameFailed()
        }
    }

    //移动index 后面 tile的位置
    moveListTilePos(index: number) {
        for(let i = index; i < this.listTiles.length; i++) {
            let t = this.listTiles[i]
            t.changePositon(this.getListPosX(i), this.listStartY)
        }
    }

    //
    getAreaPosX(col: number):number {
        return this.areaStartX + (col + 1) * TileConfig.GRID_PX;
    }

    getAreaPosY(row: number):number {
        return this.areaStartY + (row + 1) * TileConfig.GRID_PX;
    }

    getListPosX(index: number):number {
        return this.listStartX + (index*TileConfig.TILE_GRID + 1) * TileConfig.GRID_PX;
    }

    getStackPosX(x: number, z: number): number {
        return this.stackStartX + (x * TileConfig.TILE_GRID + (z%2==0?1:2) ) * TileConfig.GRID_PX
    }

    isOverlap(a: Tile, b: Tile) {
        let lenX = Math.abs(a.x - b.x)
        let lenY = Math.abs(a.y - b.y)
        if(lenX < TileConfig.TILE_GRID && lenY < TileConfig.TILE_GRID) {
            return true
        }

        return false
    }

    gameFailed() {
        console.log("gameFailed")
        EVT.emit(TILE_EVT.FAIL)
    }

    gamePass() {
        console.log("gamePass")
        EVT.emit(TILE_EVT.PASS)
    }

    useRemove(): boolean {
        if(this.listTiles.length > 0) {
            this.itemUse[ItemType.REMOVE]++
            let mv = this.listTiles.splice(0,3) 
            mv.forEach( item => {
                this.addStackTile(item)
            })

                    //后面的图案移动
        if(this.listTiles.length > 0 ) {
            this.moveListTilePos(0)
        }
        return true
        }

        return false
    }

    useUndo(): boolean {
        if(this.listTiles.length > 0){
            this.itemUse[ItemType.UNDO]++
            let tile = this.listTiles.pop()

            if(tile.fromZone == TILE_ZONE.STACK){
                this.putStackTile(tile)
            } else if(tile.fromZone == TILE_ZONE.AREA){
                this.putAreaTile(tile)
            } else {
                console.error("error undo", tile)
                this.addStackTile(tile)
            }

            return true

        }
        return false
    }

    //洗牌放置区
    useShuffle(): boolean {
        this.itemUse[ItemType.SHUFFLE]++
        let alltiles:Tile[] = []
        this.layerTiles.forEach( layer => {
            if(layer.size > 0) {
                layer.forEach( tile => {
                    alltiles.push(tile)
                })
            }
        })

        for(let i = 0; i< alltiles.length; i++){

            let index = math.randomRangeInt(0, alltiles.length) 
            if(i != index){
                let t1 = alltiles[i]
                let t2 = alltiles[index]
                let v1 = t1.val
                let v2 = t2.val
                t1.setVal(v2)
                t1.setFace(Main.ins.tileSpriteFrames[v2])

                t2.setVal(v1)
                t2.setFace(Main.ins.tileSpriteFrames[v1])
            }
        }

        return true
    }

    useAddSlot(): boolean {
        if(this.listMaxLen > NormalListMaxLen){
            return false
        }
        this.itemUse[ItemType.ADDSLOT]++
        this.listMaxLen++
        return true

    }

    useRelive(): boolean {
        if(this.listTiles.length > 0) {
            this.itemUse[ItemType.RELIVE]++
            this.listTiles.forEach( item => {
                this.addStackTile(item)
            })
            this.listTiles = []
        }
        return true
    }

    getItemUseCount(t: ItemType):number {
        return this.itemUse[t]
    }

    getAllItemUseCount(): number {
        let count = 0
        for(let k in ItemType){
            count += this.itemUse[k]
        }
        return count
    }        


}
