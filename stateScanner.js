/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
module.exports.stateScanner = function () {
    // 每 20 tick 运行一次
    if (Game.time % 20) return 
  
    if (!Memory.stats) Memory.stats = {}
    
    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
    Memory.stats.gclLevel = Game.gcl.level
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
    Memory.stats.gplLevel = Game.gpl.level
    // CPU 的当前使用量
    Memory.stats.cpu = Game.cpu.getUsed()
    // bucket 当前剩余量
    Memory.stats.bucket = Game.cpu.bucket

    //  自己添加的
    //  储存的能量
    Memory.stats.energy = Game.rooms['W16S19'].storage.store[RESOURCE_ENERGY];
    //  rcl等级和进度
    Memory.stats.rclLevel = Game.rooms['W16S19'].controller.level;
    Memory.stats.rclProgress = Game.rooms['W16S19'].controller.progress;
    Memory.stats.rclProgressTotal = Game.rooms['W16S19'].controller.progressTotal;
}