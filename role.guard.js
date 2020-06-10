var roleGuard = {
    targets : {
        //  守护点
        '0' : {
            pos : new RoomPosition(33, 11, 'W17S21'),   // 矿点4,5
            id : '5bbcabf49099fc012e6348e0',
        },
        '1' : {
            pos : new RoomPosition(13, 13, 'W15S19'),   //  矿点0,1
            id : '5bbcac0f9099fc012e634d10',
        },
        '2' : {
            pos : new RoomPosition(43, 33, 'W15S18'),   //  矿点2,3
            id : '5bbcac0f9099fc012e634d0b',
        },
        '3' : {
            pos : new RoomPosition(45, 24, 'W15S18'),
            id : '5bbcac0f9099fc012e634d0a',
        },
        '4' : {
            pos : new RoomPosition(38, 2, 'W17S21'),
            id : '5bbcabf49099fc012e6348e0',
        },
        '5' : {
            pos : new RoomPosition(44, 37, 'W17S21'),
            id : '5bbcabf49099fc012e6348e2',
        },
    },
    /** @param {Creep} creep **/
    run : function (creep) {
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
            //  有敌人
            var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(enemy){
                console.log(creep.name, 'find enemy', enemy);
                if(creep.attack(enemy) == ERR_NOT_IN_RANGE){
                    creep.say("Fight!!!");
                    creep.moveTo(enemy);
                }
            }
            //  无敌人，就在附近保护
            else{
                if(creep.pos.isEqualTo(this.targets[id].pos)){
                    creep.say("就位!");
                }
                else{
                    creep.say('前往保护！');
                    creep.moveTo(this.targets[id].pos);
                }
            }
        }
    }
}


module.exports = roleGuard;