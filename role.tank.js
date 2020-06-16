var roleTank = {
    targets : {
        '0' : {
            pos : new RoomPosition(48, 35, 'E49S26'),
            id : '5bbcaff99099fc012e63b720',
            target_pos : new RoomPosition(1, 35, 'E49S25'),
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
        if(!(creep.pos.roomName == this.targets[id].pos.roomName || creep.pos.roomName == this.targets[id].target_pos.roomName)){
            creep.say("Move!");
            creep.moveTo(this.targets[id].pos, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
        } 
        //  在目标房间
        else{
            if(creep.hits == creep.hitsMax){
                creep.say('前去抗伤害!');
                creep.moveTo(this.targets[id].target_pos);
            }
            else if(creep.hits > 2000){
                /** @todo */
            }
            else {
                creep.say('回血!');
                creep.moveTo(this.targets[id].pos);
            }
        }
    }
}


module.exports = roleTank;