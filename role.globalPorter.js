var roleGlobalPorter = {
    targets : {
        '0' : {
            pos : new RoomPosition(26, 4, 'W15S19'),
            id : '5bbcac0f9099fc012e634d0e',
            'out': [
                '5edf82474d2ceba4e20dd55a', //  Storage
            ],
        },
        '1' : {
            pos : new RoomPosition(44, 21, 'W15S19'),
            id : '5bbcac0f9099fc012e634d10',
            'out': [
                '5edf82474d2ceba4e20dd55a', //  Storage
            ],
        },
    },
    /** @param {Creep} creep **/
    run: function (creep) {
        var id = creep.name.slice(-1);
        //  当前允许'0' ~ '9'共10个不同的分工
        if(id < '0' || id > '9'){
            id = '0';   //  默认分工为'0'号分工
        }

        //  当 处于输出状态 & 身体里没有能量 -> 补充能量
        if(creep.memory.transsferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transsferring = false;
            creep.say('🔄 Input!');
        }
        //  当 处于输入状态 & 身体里能量满了 -> 输出能量
        if(!creep.memory.transsferring && creep.store.getFreeCapacity() == 0) {
            creep.memory.transsferring = true;
            creep.say('⚡ Transferring');
        }
        
        /**
         * 输出模式
         * 当前策略：
         *      寻找输出目标中能量最少的容器进行输出
         *      (2020/06/09) 寻找输出目标中剩余空间最大的输出 (废弃)
         *      (2020/06/09) 寻找输出目标中未满的能量最少的容器进行输出
         * 目标策略：
         *      可能需要权衡移动距离，
         *      并且考虑在多个输出creeps时，目标饱和的情况
         *          （通过预定来解决？类似任务系统）
         */
        if(creep.memory.transsferring) {
            var final_target = null, minimal_energy = 99999999;
            for(var target in this.targets[id]['out']){
                //  更新当前存储量最小的容器
                if(!Game.getObjectById(this.targets[id]['out'][target])){
                    console.log(creep.name, "can't find output target!", this.targets[id]['out'][target]);
                }
                else{
                    //  考虑已经空闲空间不足1下的情况
                    if(Game.getObjectById(this.targets[id]['out'][target]).store.getFreeCapacity(RESOURCE_ENERGY) < 400){
                        continue;
                    }
                    //  更新最少的那个目标容器
                    if(Game.getObjectById(this.targets[id]['out'][target]).store[RESOURCE_ENERGY] < minimal_energy){
                        minimal_energy = Game.getObjectById(this.targets[id]['out'][target]).store[RESOURCE_ENERGY];
                        final_target = this.targets[id]['out'][target];
                    }
                }
            }
            if(Memory.debugMode){
                console.log(creep.name, "'s final target is", Game.getObjectById(final_target));
            }
            if(creep.transfer(Game.getObjectById(final_target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.say("⚒Transferring⚡");
                //  当处于debugMode中详细输出
                if(Memory.debugMode){
                    console.log(creep.name, "go to", Game.getObjectById(final_target));
                }
                creep.moveTo(Game.getObjectById(final_target), {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
            }
        }
        else{
            //  不在正确的房间
            if(creep.pos.roomName != this.targets[id].pos.roomName){
                creep.say("Move!");
                creep.moveTo(this.targets[id].pos, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
            } 
            //  在同一个房间
            else{
                var resource = creep.room.find(FIND_DROPPED_RESOURCES);
                if(resource.length){
                    
                    for(i in resource){
                        //  找到资源
                        if(resource[i].pos.isEqualTo(this.targets[id].pos)){
                            //  捡拾资源
                            if(creep.pickup(resource[i]) == ERR_NOT_IN_RANGE){
                                creep.say("MOVE!!!");
                                creep.moveTo(this.targets[id].pos, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
                            }
                            break;
                        }
                    }
                }
                else{
                    creep.say("No resource");
                    console.error(creep.name, "can't find resource!");
                }
            }
        }
        
    }
}

module.exports = roleGlobalPorter;