import { _decorator, Component, Node, tween, Vec3, Tween } from 'cc';
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
       })
   }

   stopHeartBeat() {
       Tween.stopAllByTag(this.tweenTag)
   }
}