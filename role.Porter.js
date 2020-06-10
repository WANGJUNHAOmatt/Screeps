const { filter } = require("lodash");

var rolePorter = {
    //  地上掉落的资源（暂未启用）
    resource : [],

    targets :  {
        '0': {
            //  输入                      
            'in': [
                '5edf60335c8fede4ed0b08e6', //  矿[0] 
                '5edf550ebcf2e480efa2776d', //  矿[1]
                '5edfff8c66081f4dcc883f93', //  GlobalPorter 暂存地
            ],
            //  输出
            'out': [
                // '5ede3f1bba71206ff44405b8',     //  原中心容器
                '5ede9186424225bfa8e29658',     //  炮塔旁的容器
                '5edf82474d2ceba4e20dd55a',     //  Storage
                '5ede7d734039d213a6af584a',     //  升级RCL的容器
            ],
        },
        //  '1' 为了节约，已经弃用
        '1':{
            //  输入     
            'in': [
                '5edf550ebcf2e480efa2776d',     //  矿[1]
                '5ede9186424225bfa8e29658',     //  炮塔旁的容器
                '5edf82474d2ceba4e20dd55a',     //  Storage
            ],
            //  输出
            'out': [
                '5ede7d734039d213a6af584a',     //  升级RCL的容器
            ],
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        /**
         * creep.memory.transfering | Boolean | true: 输出, false: 输入
         * @praga id 不同的id，对应targets中的输入输出目标不同，实现分工
         */
        //  获取Creep的名字（编号） -> 固定的id决定它的输入输出
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
                creep.moveTo(Game.getObjectById(final_target), {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        /**
         * 输入模式
         * 当前策略：
         *      寻找输出目标中能量最多的容器进行输入
         *      (2020/06/09新增) 寻找资源（需要特判手动添加）
         * 目标策略：
         *      可能需要权衡移动距离，
         *      并且考虑在多个输出creeps时，目标透支的情况
         *          （通过预定来解决？类似任务系统）
         */
        else {
            var tombstone = creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => {
                    return tombstone.store[RESOURCE_ENERGY];
                }
            })
            if(tombstone.length){
                console.log(creep.name, "find tombstone.");
                if(creep.pickup(tombstone[0]) == ERR_NOT_IN_RANGE){
                    creep.say("挖坟去！");
                    creep.moveTo(tombstone[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            //  特判 -> 捡拾resource
            if(this.resource.length){
                if(creep.pickup(Game.getObjectById('5edf5ea15b130af755023ed3'), ) == ERR_NOT_IN_RANGE){
                    creep.say("resource⚡");
                    creep.moveTo(Game.getObjectById('5edf5ea15b130af755023ed3'), {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                var final_target = null, maximal_energy = 0;
                //  捡拾 container
                if(Memory.debugMode){
                    console.log(creep.name, "is inputing.");
                }
                for(var target in this.targets[id]['in']){
                    //  更新当前存储量最大的容器
                    if(!Game.getObjectById(this.targets[id]['in'][target])){
                        console.log(creep.name, "can't find input target!", this.targets[id]['in'][target]);
                    }
                    else{
                        if(Game.getObjectById(this.targets[id]['in'][target]).store[RESOURCE_ENERGY] > maximal_energy){
                            maximal_energy = Game.getObjectById(this.targets[id]['in'][target]).store[RESOURCE_ENERGY];
                            final_target = this.targets[id]['in'][target];
                        }
                    }
                }
                if(Game.getObjectById(final_target).store[RESOURCE_ENERGY] < creep.store.getFreeCapacity(RESOURCE_ENERGY) && creep.room.storage.store[RESOURCE_ENERGY] >= creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                    final_target = creep.room.storage.id;
                    creep.say("取钱！");
                    console.log(creep.name, '输入资源不足');
                }
                if(creep.withdraw(Game.getObjectById(final_target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.say("input⚡");
                    creep.moveTo(Game.getObjectById(final_target), {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
                }
            }
            
        }
    }
};

module.exports = rolePorter;