var roleHarvester = {
    /**
     * 名称：Harvester
     * 功能：挖矿
     * 特性：出生-移动到挖矿点-挖矿至死
     * 注意：挖矿点需要手动指定。
     */
    pos: {
        0: [28, 7],
        1: [27, 14],
    },
    run: function(creep) {
        //  查找房间中的资源
        var sources = creep.room.find(FIND_SOURCES);
        //  获取Creep的名字（编号） -> 固定的id决定它挖掘哪个矿
        var id = creep.name.slice(-1) - '0';

        // temp 特判
        if(id > 1) id = 0;

        //  增加计数（记录累计挖矿数量）
        creep.memory.count += 10;
        //  每10tick，报告总挖矿数量
        if(Game.time % 10 == 0){
            creep.say(creep.memory.count);
        }
        //  在大限将至时，清空挖矿数量
        if(creep.ticksToLive < 10){
            creep.say('I am Dying.');
            creep.memory.count = 0;
        }
        //  移动到指定挖矿点
        if(creep.pos['x'] != this.pos[id][0] || creep.pos['y'] != this.pos[id][1]){
            creep.moveTo(this.pos[id][0], this.pos[id][1]);
        }

        //  正常挖矿 -由于没有CARRY模块，挖矿会掉落到脚底的Container中
        if(creep.harvest(sources[id]) == ERR_NOT_IN_RANGE) {
            creep.say("⚒ On my way! ⚡⚡⚡");
            creep.memory.count -= 10;
            //  绘制路径
            creep.moveTo(sources[id], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = roleHarvester;