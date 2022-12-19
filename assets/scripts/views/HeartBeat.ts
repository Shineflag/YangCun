import { _decorator, Component, Node, tween, Vec3, Tween, math } from 'cc';
const { ccclass, property } = _decorator;

const HighScale = new Vec3(1,1.2,1)
const LowScale = new Vec3(1,1,1)
function heartBeat(node: Node, tag: number) {
   let t1 =  tween(node.scale).to(0.1, HighScale, {
       easing:"backOut",
       onUpdate: (target: Vec3) => {
           node.scale = target
       }
   })

   let t2 =  tween(node.scale).to(0.1, LowScale, {
       easing: "bounceOut",
       onUpdate: (target: Vec3) => {
           node.scale = target
       }
   })
   .delay(0.3)

   tween(node.scale).sequence(t1,t2).repeatForever().tag(tag)
   .start()
}

function move(node: Node, tag: number){
    let t = math.randomRangeInt(1,3)
    let speedx = math.randomRangeInt(-50, 50)
    let speedy = math.randomRangeInt(-50, 50)
    let dstx = speedx*t 
    let dsty = speedy*t 
    let pos = node.position;
    if(pos.x + dstx < 0 || pos.x + dstx > 720){
        dstx = -dstx
    }

    if(pos.y + dsty < 0 || pos.y + dsty > 1280){
        dsty = -dsty
    }

    // if(speedx > 0){
    //     node.setScale(-1,1)
    // }else {
    //     node.setScale(1,1)
    // }
    tween(node.position).by(t, new Vec3(dstx, dsty, 0),{
        onUpdate:(target: Vec3) => {
            node.position = target
        }
    })
    .call( () => {
        move(node, tag);
    })
    .start()
}

@ccclass('HeartBeat')
export class HeartBeat extends Component {

   @property(Node)
   root: Node

   tweenTag: number

   onEnable() {
    this.startHeartBeat()
   }

   onDisable() {
       this.stopHeartBeat()
   }


   startHeartBeat() {
       this.tweenTag = Date.now()
       this.root.children.forEach( node => {
           heartBeat(node, this.tweenTag)
           move(node, this.tweenTag)
       })
   }

   stopHeartBeat() {
       Tween.stopAllByTag(this.tweenTag)
   }
}