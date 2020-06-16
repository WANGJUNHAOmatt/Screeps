var roleReserver = {
    targets : {
        //  守护点
        '0' : {
            pos : new RoomPosition(18, 38, 'E49S26'),
        },
        '1' : {
            pos : new RoomPosition(25, 25, 'E48S25'),
        },
        '2' : {
            pos : new RoomPosition(30, 28, 'E49S27'),
        },
        '3' : {
            pos : new RoomPosition(40, 18, 'E48S27'),
        },
        '4' : {
            pos : new RoomPosition(10, 47, 'E47S25'),
        },
        '5' : {
            pos : new RoomPosition(32, 17, 'E49S25'),
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
            creep.say("Reserve!");
            if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
        }
    }
}


module.exports = roleReserver;