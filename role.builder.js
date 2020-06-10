var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //  获取Creep的名字（编号） -> 固定的id决定它的输入输出
        var id = creep.name.slice(-1);
        //  当前允许'0' ~ '9'共10个不同的分工
        if(id < '0' || id > '9'){
            id = '0';   //  默认分工为'0'号分工
        }
        /**
         * id == '0' 可以为spawn和extension补充能量
         * id == '1' 可以为spawn和extension补充能量
         */

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 input');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            /**
             * 维护（补充能量） | 按照id进行分工
             * 当builder00，和builder01都在场时 -> builder00 负责
             * 当builder01 或 builder00 死亡时，另一个人负责
             * (?)当两个工人都死亡时 -> 没人管了就...
             */
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                        (structure.store.getCapacity < creep.store[RESOURCE_ENERGY] || structure.store.getFreeCapacity > [RESOURCE_ENERGY]);
                        /** 新增过滤：
                         *      空间本身就小于creep的容量的 || 
                         *      剩余空间大于creep当前的容量的
                        */
                }
            });
            if(target && (id == '0' && !Game.creeps['Builder01'])||( id == '1' && !Game.creeps['Builder00']) || ((Game.creeps['Builder00'] && Game.creeps['Builder01']) && id == '0') ) {
                //  优先考虑非防御塔
                
                //  新增最近非防御塔目标
                var closestTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (   structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                            (structure.store.getCapacity < creep.store[RESOURCE_ENERGY] || structure.store.getFreeCapacity > [RESOURCE_ENERGY]);
                            /** 新增过滤：
                             *      空间本身就小于creep的容量的 || 
                             *      剩余空间大于creep当前的容量的
                            */
                    }
                });
                
                //  找到最近的非防御塔目标
                if(closestTarget){
                    if(Memory.debugMode){
                        console.log(creep.name, "find target", closestTarget);
                    }
                    if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                //  如果其他的都满了则补充塔
                else{
                    if(Memory.debugMode){
                        console.log(creep.name, '给防御塔充电');
                    }
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            else{
                //  建筑
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                //  维修
                else{                
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: object => object.hits < object.hitsMax
                    });
                    
                    targets.sort((a,b) => a.hits - b.hits);
                    
                    if(targets.length > 0) {
                        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
            }
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_CONTAINER  ||
                        structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity(RESOURCE_ENERGY))
                }
            });
            if(target){
                // console.log(creep.name, " find ", target);                
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else{
                creep.say("No enough energy!");
                // console.log(creep.store.getFreeCapacity(RESOURCE_ENERGY));
            }
        }
    }
};

module.exports = roleBuilder;