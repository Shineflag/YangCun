import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, tween, Vec3 } from 'cc';
import { TileAnimTime, TILE_ZONE } from './constants';
import { EVT, TILE_EVT } from './event';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {

    @property(Node)
    mask: Node

    @property(Sprite)
    face: Sprite

    val: number

    x: number
    y: number
    z: number

    priority: number
  
    baseScale: number
    bigScale: number = 1.2 //变大后的缩放

    zone:TILE_ZONE = TILE_ZONE.NONE //是否在 消除列表框

    topTiles: Set<Tile> = new Set()
    bottomTiels: Set<Tile> = new Set()


    onEnable() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnded, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    }

    onDisable() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnded, this)
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    }


    start() {
        this.baseScale = this.node.scale.x 
        this.bigScale = this.baseScale * 1.2
    }

    update(deltaTime: number) {
        this.changeMask()
    }

    //是否显示mask
    get active() {
        return this.topTiles.size <= 0
    }

    get idx() {
        return `${this.z}-${this.x}-${this.y}`
    }

    onTouchStart() {
        console.log("onTouchStart",this.idx, this.zone, this.active)
        if(this.zone < TILE_ZONE.AREA) return 
        if(this.active) {
            this.setLargeScale()
        }
    }

    onTouchEnded() {
        console.log("onTouchStart",this.idx, this.zone, this.active)
        if(this.zone < TILE_ZONE.AREA) return 
        if(this.active) {
            EVT.emit(TILE_EVT.SELECT, this)
        }
    }

    
    onTouchCancel() {
        console.log("onTouchStart",this.idx, this.zone, this.active)
        if(this.zone < TILE_ZONE.AREA) return  
        if(this.active) {
            this.setBaseScale()
        }
    }

    setAreaIndex(x:number, y: number, z: number) {
        this.zone = TILE_ZONE.AREA

        this.x = x
        this.y = y 
        this.z = z 

        this.priority = z * 1000 - y 
        this.getComponent(UITransform).priority = this.priority
    }

    setPosition(x:number, y:number){
        console.log(this.idx, "tile setPosition", x,y)
        this.node.setPosition(x,y)
    }

    changePositon(x:number, y:number) {
        tween(this.node.position).to(TileAnimTime.MOVE, new Vec3(x,y,0), {
            onUpdate: (target: Vec3, ratio: number) =>{
                this.node.position = target
            }
        })
        .call( () => {
            this.setBaseScale()
        })
        .start()
    }

    setVal(val: number) {
        this.val = val 
    }

    setFace(frame: SpriteFrame) {
        this.face.spriteFrame = frame
    }

    addTopTile(tile: Tile) {
        this.topTiles.add(tile)

        // console.log(this.idx ,"has top count", this.topTiles.size)
    }

    removeTopTile(tile: Tile) {
        this.topTiles.delete(tile)
    }

    addBottomTile(tile: Tile) {
        this.bottomTiels.add(tile)
    }

    changeMask() {
        if(this.active) {
            this.mask.active = false
        } else {
            this.mask.active = true
        }
    }

    setBaseScale() {
        this.node.setScale(this.baseScale, this.baseScale)

        this.node.getComponent(UITransform).priority = this.priority
    }

    setLargeScale() {
        this.node.setScale(this.bigScale, this.bigScale)
        this.node.getComponent(UITransform).priority = 10000 * 1000
    }

    toListZone() {
        this.zone = TILE_ZONE.LIST
        this.topTiles.clear()
        this.bottomTiels.clear()
    }

        //消除
        erase() {
            tween(this.node.scale).to(TileAnimTime.MOVE, new Vec3(0,0,0), {
                onUpdate: (target: Vec3, ratio: number) =>{
                    this.node.scale = target
                },
                onComplete: (target ) => {
                    this.delete()
                }
            }).start()
        }
    
        delete() {
            this.node.removeFromParent()
        }
    
}


