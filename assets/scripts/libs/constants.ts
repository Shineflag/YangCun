//方块所处位置
export const enum TILE_ZONE  {
    NONE = 0,
    LIST,
    AREA,
    STACK,
}

//tile 游戏相关配置
export const enum TileConfig {
    GRID_PX = 40,     //一个格子像素
    TILE_GRID = 2,    //一个方块的边长是几格
    STACK_TILE = 8,    //堆每层最多放几个
}

export enum Setting {
    SOUND = "SET_SOUND",
    MUSIC = "SET_MUSIC",
}  


export const enum TileAnimTime {
    MOVE = 0.25
}

//日期相关
export const  enum DATE {
    SECOND = 1000,
    MIN = 60
}

export enum LvStatus {
    Lock = 0,  //未解锁
    Unlock,    //解锁
    Pass,      //已过关
} 

//游戏的一些数值配置
export const enum DataConfig {
    BASE_GOLD = 50,
    MAX_POWER = 25,
    ADD_POWER_TIME = 120
}

export enum ViewName {
    HomeView = "HomeView",
    LevelView = "LevelView",
    GameView = "GameView",
}

export type KViewName = keyof typeof ViewName


export enum DialogName {

}

export enum ItemType {
    REMOVE = "REMOVE",  //移出
    UNDO = "UNDO",      //撤回
    SHUFFLE = "SHUFFLE", //洗牌
    ADDSLOT = "ADDSLOT", //加槽
    RELIVE  = "RELIVE",  //复活
}

export const GOLD_COST =  {
    [ItemType.REMOVE] : 15,  //移出
    [ItemType.UNDO] : 10,      //撤回
    [ItemType.SHUFFLE] :5, //洗牌
    [ItemType.ADDSLOT] : 15, //加槽
    [ItemType.RELIVE] : 25,  //复活
}

export const enum POWER_COST {
    POWER_FIRST = 5, //新关卡 
    POWER_AGAIN = 1  //重新挑战
}

export const enum PropsType {
    POWER = 0,  //能量
    GOLD = 1,   //金币
}

//音效
export enum AClip {
    CLICK = 0, //点击
    THREE,    //合成三个
    START,    //游戏开始
    ROCK,     //方块转动
    SCENE,     //场景切换
    WIN,       //过关
    LOSE,      //失败
}



