var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');


// creep的角色
/*
    "role":{
        "number": 需要保持的数量,
        "body": 身体的组成,
        "cost": 当前身体组成所需的花费
    }
*/
var creeps_roles = {
    //  采集/升级/建筑者，WORK，MOVE模块为主
    "worker" : {
        "number": 3,
        "body" : [WORK, WORK, WORK, CARRY, MOVE],
        "cost" : 400,
    }, 
    //  搬运能源，CARRY，MOVE为主
    "porter" : {},
    //  建筑/维护，WORK，CARRY，MOVE
    "builder" : {

    }
}

var spawning_list = [];

module.exports.loop = function () {

    //  简单的死亡控制
    // var creeps = Game.creeps;
    

    // var tower = Game.getObjectById('TOWER_ID');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //  死亡上报复生机制
        if(Game.creeps[name].ticksToLive <= 1000){
            if(Game.creeps[name]){
                // Game.creeps[name].say("I am dying.");
                // // spawning_list.push([name, Game.creeps.name.])
                // console.log("creep is dying.");
            }
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}