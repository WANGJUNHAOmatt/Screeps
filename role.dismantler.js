var roleDismantler = {
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
            if(!creep.memory.attack && creep.hits == creep.hitsMax){
                creep.memory.attack = true;
                creep.say('Attack!!!');
            }
            if(creep.memory.attack && creep.hits <= 2000){
                creep.memory.attack = false;
                creep.say('Help me!');
            }
            //  进攻模式
            if(creep.memory.attack){
                //  进入正确的房间
                if(creep.pos.roomName == this.targets[id].target_pos.roomName){
                    creep.say("Fight Start!");
                    var structure = creep.pos.findClosestByPath(structure, {
                        filter : (structure) => {
                            return structure.structureType == STRUCTURE_RAMPART;
                        }
                    })
                    if(structure){
                        creep.say('dismantle!');
                        if(creep.dismantle(structure) == ERR_NOT_IN_RANGE){
                            creep.moveTo(structure);
                        }
                    }
                }
                else{
                    creep.moveTo(this.targets[id].target_pos);
                    creep.say("Move to Target!");
                }
            }
            //  回血模式
            else{
                /**@TODO */
            }
        }
    }
}


module.exports = roleDismantler;