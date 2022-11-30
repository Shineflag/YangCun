//方块所处位置
export enum TILE_ZONE  {
    NONE = 0,
    LIST,
    AREA,
    STACK,
}

//tile 游戏相关配置
export enum TileConfig {
    GRID_PX = 40,     //一个格子像素
    TILE_GRID = 2,    //一个方块的边长是几格
}

export enum TileAnimTime {
    MOVE = 0.25
}