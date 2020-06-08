var rolePorter = {

    targets :  {
        '0': {
            'in': ['5ede31975164a63bb4923b8d', '5ede2c3b85eaecf2f8a60767'],
            'out': ['5ede3f1bba71206ff44405b8', '5ede9186424225bfa8e29658'],
        },
        '1':{
            'in': ['5ede3f1bba71206ff44405b8', '5ede9186424225bfa8e29658'],
            'out': ['5ede3f1bba71206ff44405b8', '5ede7d734039d213a6af584a', '5ede9186424225bfa8e29658'],
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
         * 目标策略：
         *      可能需要权衡移动距离，
         *      并且考虑在多个输出creeps时，目标饱和的情况
         *          （通过预定来解决？类似任务系统）
         */
        if(creep.memory.transsferring) {
            var final_target = null, minimal_energy = 999999;
            for(var target in this.targets[id]['out']){
                // console.log(target);
                // console.log(Game.getObjectById(this.targets[id]['out'][target]).store[RESOURCE_ENERGY]);
                //  更新当前存储量最小的容器
                if(Game.getObjectById(this.targets[id]['out'][target]).store[RESOURCE_ENERGY] < minimal_energy){
                    minimal_energy = Game.getObjectById(this.targets[id]['out'][target]).store[RESOURCE_ENERGY];
                    final_target = this.targets[id]['out'][target];
                    // console.log("final target:", final_target);
                }
                // console.log(Game.getObjectById(this.targets[id]['out'][target]).storeCapacity);
            }
            if(creep.transfer(Game.getObjectById(final_target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.say("⚒ On my way! ⚡");
                creep.moveTo(Game.getObjectById(final_target));
            }
        }
        /**
         * 输入模式
         * 当前策略：
         *      寻找输出目标中能量最多的容器进行输入
         * 目标策略：
         *      可能需要权衡移动距离，
         *      并且考虑在多个输出creeps时，目标透支的情况
         *          （通过预定来解决？类似任务系统）
         */
        else {
            var final_target = null, maximal_energy = 0;
            for(var target in this.targets[id]['in']){
                // console.log(target);
                // console.log(Game.getObjectById(this.targets[id]['in'][target]));
                //  更新当前存储量最大的容器
                if(Game.getObjectById(this.targets[id]['in'][target]).store[RESOURCE_ENERGY] > maximal_energy){
                    maximal_energy = Game.getObjectById(this.targets[id]['in'][target]).store[RESOURCE_ENERGY];
                    final_target = this.targets[id]['in'][target];
                }
                // console.log(this.targets[id]['in'][target].storeCapacity);
            }
            if(creep.withdraw(Game.getObjectById(final_target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.say("⚒ On my way! ⚡");
                creep.moveTo(Game.getObjectById(final_target));
            }
        }
    }
};

module.exports = rolePorter;