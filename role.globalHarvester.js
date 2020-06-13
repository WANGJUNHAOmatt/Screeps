var roleGolbalHarvester = {
    targets : {
        '0' : {
            pos : new RoomPosition( 19, 37, 'E49S26'),
            id : '5bbcaff99099fc012e63b720',
        },
        '1' : {
            pos : new RoomPosition(7, 42, 'E48S25'),
            id : '5bbcafe59099fc012e63b59d',
        },
        '2' : {
            pos : new RoomPosition(12, 6, 'E48S25'),
            id : '5bbcafe59099fc012e63b59b',
        },
        '3' : {
            pos : new RoomPosition(24, 35, 'E49S27'),
            id : '5bbcaff99099fc012e63b724',
        },
        '4' : {
            pos : new RoomPosition(38, 9, 'E48S27'),
            id : '5bbcafe69099fc012e63b5a4',
        },
        '5' : {
            pos : new RoomPosition(8, 45, 'E47S25'),
            id : '5bbcafd49099fc012e63b40f',
        }
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