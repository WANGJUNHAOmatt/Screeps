var roleExplorer = {
    target : new RoomPosition( 17, 7, 'W15S19'),
    run : function(creep) {
        if(creep.pos.roomName != this.target.roomName){
            creep.say('Move!');
            creep.moveTo(this.target, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
        }
        else{
            creep.say('Reserve!');
            if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(this.target, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
            }  
        }
    }
}

module.exports =roleExplorer;