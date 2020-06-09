var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var rolePorter = require('role.Porter');
var stateScanner = require('stateScanner').stateScanner;

Memory.debugMode = false;

// creep的角色
/*
    "role":{
        "number": 需要保持的数量,
        "body": 身体的组成,
        "cost": 当前身体组成所需的花费
    }
*/
var creeps_roles = {
    //  采集者
    "harvester" : {
        "number": 2,
        "body" : [WORK, WORK, WORK, WORK, WORK, MOVE],
        "cost" : 550,
    }, 
    //  搬运能源，CARRY，MOVE为主
    "porter" : {
        "number": 4,
        "body" : [
                    CARRY, CARRY, CARRY, CARRY, CARRY, 
                    CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE
                ],
        "cost" : 600,
    },
    //  建筑/维修，WORK，CARRY，MOVE
    "Builder" : {
        "number": 3,
        "body" : [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
        "cost" : 550,
    }, 

    // TODO: 重构这段职业 -> 任务发布式
    //  待重构代码的upgrader
    "upgrader" : {
        "number": 2,
        "body" : [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        "cost" : 550,
    }, 
    //  待重构代码的builder
    "builder" : {
        "number": 3,
        "body" : [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
        "cost" : 550,
    }, 
}


// 生产函数
function build(_role, name){
    if(creeps_roles[_role]){
        Game.spawns.Base.spawnCreep(creeps_roles[_role]["body"], name, {memory: {role: _role}});
        console.log('spawning creep', _role, name);
    }
} 

/** @param Memory.spawning_list  生产队列 **/
// Memory.spawning_list = [];

var testflag = false;

module.exports.loop = function () {
    //  测试代码区，每次保存执行一次
    if(testflag){
        testflag = false;
        

        build('porter', 'Upgrader00');
    }

    // // 防御塔
    var tower = Game.getObjectById('5edebfd94e312941cfb6f2fe');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }

        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits + 200 < structure.hitsMax && 
                        structure.structureType != STRUCTURE_WALL)
            }
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }
    
    //  简单的死亡控制
    for(name in Memory.creeps){
        // console.log("Doing respawn test:", name);
        if(!Game.creeps[name]){
            console.log(name, " is died.");
            build(Memory.creeps[name].role, name);
            break;
        }
    }
    

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        //  死亡上报复生机制
        // if(Game.creeps[name].ticksToLive <= 1000){
        //     if(Game.creeps[name]){
        //         // Game.creeps[name].say("I am dying.");
        //         // // spawning_list.push([name, Game.creeps.name.])
        //         // console.log("creep is dying.");
        //     }
        // }
        if(!Game.creeps[name]){
            console.log(name + 'is died.');
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
        if(creep.memory.role == 'porter') {
            rolePorter.run(creep);
        }   
    }

    stateScanner();
}

/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
