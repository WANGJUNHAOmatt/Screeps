var roleGolbalHarvester = {
    targets : {
        '0' : {
            pos : new RoomPosition(26, 4, 'W15S19'),
            id : '5bbcac0f9099fc012e634d0e',
        },
        '1' : {
            pos : new RoomPosition(44, 21, 'W15S19'),
            id : '5bbcac0f9099fc012e634d10',
        },
        '2' : {
            pos : new RoomPosition(39, 26, 'W15S18'),
            id : '5bbcac0f9099fc012e634d0b',
        },
        '3' : {
            pos : new RoomPosition(45, 24, 'W15S18'),
            id : '5bbcac0f9099fc012e634d0a',
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
            if(creep.harvest(Game.getObjectById(this.targets[id].id)) == ERR_NOT_IN_RANGE){
                creep.say("MOVE!!!");
                creep.moveTo(this.targets[id].pos, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
            }
        }
    }
}


module.exports = roleGolbalHarvester;