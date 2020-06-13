var roleGuard = {
    targets : {
        //  守护点
        '0' : {
            pos : new RoomPosition(18, 38, 'E49S26'),
            id : '5bbcaff99099fc012e63b720',
        },
        '1' : {
            pos : new RoomPosition(25, 25, 'E48S25'),
            id : '5bbcafe59099fc012e63b59d',
        },
        '2' : {
            pos : new RoomPosition(30, 28, 'E49S27'),
            id : '5bbcaff99099fc012e63b724',
        },
        '3' : {
            pos : new RoomPosition(40, 18, 'E48S27'),
            id : '5bbcafe69099fc012e63b5a4',
        },
        '4' : {
            pos : new RoomPosition(10, 47, 'E47S25'),
            id : '5bbcafd49099fc012e63b40f',
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