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
            //  新增最近需要补充能量的目标
            var closestTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    //  EXTENSION 或者是 SPAWN 或者是 能量低于700的TOWER
                    (structure.structureType == STRUCTURE_EXTENSION || 
                    structure.structureType == STRUCTURE_SPAWN ||
                    (structure.structureType == STRUCTURE_TOWER && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 300)) && 
                    //  必须有需要补充能量
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                }
            });
            //  找到需要补充能量的所有目标
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        //  EXTENSION 或者是 SPAWN 或者是 能量低于700的TOWER
                        (structure.structureType == STRUCTURE_EXTENSION || 
                        structure.structureType == STRUCTURE_SPAWN ||
                        (structure.structureType == STRUCTURE_TOWER && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 300)) && 
                        //  必须有需要补充能量
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                    }
                });
            if(Memory.debugMode){
                console.log(creep.name, '的目标数量为:', targets.length);
            }
            //  充能

            // 先前的判断条件
            //  && (id == '0' && !Game.creeps['Builder01'])||( id == '1' && !Game.creeps['Builder00']) || ((Game.creeps['Builder00'] && Game.creeps['Builder01']) && id == '0') 

            //  新增判断条件，两个人都活着，且总目标大于等于15，id为'1'的不进行维护
            if(closestTarget && (id == '0' ||( id == '1' && !Game.creeps['Builder00']) || (id == '1' && (Game.creeps['Builder00'] && Game.creeps['Builder01']) && targets.length >= 15))) {
                
                if(Memory.debugMode){
                    console.log(creep.name, "充能", closestTarget);
                }
                if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            //  建筑
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(Memory.debugMode){
                    console.log(creep.name, "建筑", target);
                }
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            //  维修             
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => {
                    return (object.hitsMax - object.hits > 200 &&
                        object.structureType != STRUCTURE_WALL)
                }
            });
            
            if(target) {
                if(Memory.debugMode){
                    console.log(creep.name, "维修", target);
                }
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
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