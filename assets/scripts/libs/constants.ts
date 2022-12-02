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
}

export const enum TileAnimTime {
    MOVE = 0.25
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

export enum ItemGold {
    REMOVE = 25,  //移出
    UNDO = 10,      //撤回
    SHUFFLE = 15, //洗牌
    ADDSLOT = 30, //加槽
    RELIVE  = 30,  //复活
}
