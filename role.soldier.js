module.exports.roleSoldier = {
    targets : {
        '0' : {
            pos : new RoomPosition(5, 23, 'E49S25'),
        } 
    },

    /** @param {Creep} creep */
    run : function (creep){
        //  获取id
        var id = creep.name.slice(-1);
        //  当前允许'0' ~ '9'共10个不同的分工
        if(id < '0' || id > '9'){
            id = '0';   //  默认分工为'0'号分工
        }

        //  不在正确的房间
        if(creep.pos.roomName != this.targets[id].pos.roomName){
            creep.say("Move!");
            creep.moveTo(this.targets[id].pos, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
        } 
        //  在同一个房间
        else{
            //  攻击creep
            var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(enemy){
                if(creep.attack(enemy) == ERR_NOT_IN_RANGE){
                    creep.moveTo(enemy);
                }
                return;
            }
            // 攻击Spawn
            var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
            if(enemy){
                if(creep.attack(enemy) == ERR_NOT_IN_RANGE){
                    creep.moveTo(enemy);
                }
                return;
            }
            //  攻击structure
            var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
            if(enemy){
                if(creep.attack(enemy) == ERR_NOT_IN_RANGE){
                    creep.moveTo(enemy);
                }
                return;
            }
        }
    }
}