
//玩家某关卡的数据统计
export interface ILvPlayInfo {
    id: number,  //关卡id
    firstPlay: number, //第一次玩的时间戳
    lastPlay: number,  //最后一次玩的时间
    playTimes: number, //玩了几次
    passTimes: number, //过关几次
    bestTime:number,   //最佳过关时间(秒)
    star: number,      //最佳成绩几颗星 
}

//玩家某关卡使用道具情况
export interface IlvPropInfo {
    id:number, //关卡id 
    remove: number, //移出操作
    undo: number,   //撤销操作
    shuffle: number,  //洗牌
    relive:number,   //复活
    add: number,     //加槽
}

//玩家信息
export interface IPlayerInfo {
    power: number  //体力
    gold: number   //金币
    lastAddPowerTime: number //最后加体力的世界搓
    lastLockLevel: number //最后解锁的关卡
}

//某一层的tile坐标
export interface LayerConfig {
    x:number[],
    y:number[],
}

export interface AreaConfig   {
    count: number //图案的个数
    layers: LayerConfig[] //每一层tile的坐标

}