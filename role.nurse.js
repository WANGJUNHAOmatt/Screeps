var roleNurse = {
    targets : {
        '0' : {
            pos : new RoomPosition( 19, 37, 'E49S26'),
            id : '5bbcaff99099fc012e63b720',
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
            var wounderf = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter : (creep) => {
                    return creep.hits < creep.hitsMax
                }
            })
            if(wounderf){
                creep.say('Healing!');
                if(creep.heal(wounderf) == ERR_NOT_IN_RANGE){
                    creep.moveTo(wounderf);
                }
            }
            else{
                creep.moveTo(this.targets[id].pos);
            }
        }
    }
}


module.exports = roleNurse;