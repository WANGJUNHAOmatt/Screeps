var roles = [
    'harvester', 
    'upgrader', 
    'builder', 
    'porter',
    // 'explorer',
    'globalHarvester',
    'globalPorter',
    'soldier',
    'guard',
];
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var rolePorter = require('role.porter');
var roleExplorer = require('role.explorer');
var roleGlobalHarvester = require('role.globalHarvester');
var roleGlobalPorter = require('role.globalPorter');
var roleSoldier = require('role.soldier').roleSoldier;
var roleGuard = require('role.guard');
var stateScanner = require('stateScanner').stateScanner;
var runTower = require('tower');

//  调试模式，更详细的信息
Memory.debugMode = false;


var temp_roles = ['harvester', 'builder', 'upgrader', 'porter', 'globalHarvester', 'globalPorter', 'guard'];


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
    //  (2020/06/10新增)    外矿采集者
    "globalHarvester" : {
        "number" : 2,
        "body" : [
            WORK, WORK, WORK, 
            MOVE, MOVE, MOVE,
        ],
        "cost": 450,
    },

    //  搬运能源，CARRY，MOVE为主
    "porter" : {
        "number": 1,
        "body" : [
                    CARRY, CARRY, CARRY, CARRY, CARRY, 
                    CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                    MOVE, MOVE, MOVE, MOVE,
                ],
        "cost" : 900,
    },

    //  (2020/06/10新增)    外矿搬运工
    "globalPorter" : {
        "number" : 1,
        "body" : [
            CARRY, CARRY, CARRY, CARRY, CARRY, 
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        "cost" : 1000,
    },

    //  探索家
    "explorer" : {
        "number": 1,
        "body" : [CLAIM, MOVE, MOVE],
        "cost" : 700,
    }, 

    //  (2020/06/11新增)    外矿护卫
    "guard" : {
        "number" : 1,
        "body" : [
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        "cost" : 650,
    },

    // TODO: 重构这段职业 -> 任务发布式
    //  待重构代码的upgrader
    "upgrader" : {
        "number": 1,
        "body" : [
            WORK, WORK, WORK, WORK, WORK, 
            WORK, WORK, WORK, WORK, WORK,
            CARRY, CARRY, CARRY, CARRY, 
            MOVE, MOVE,
        ],
        "cost" : 1300,
    }, 
    //  待重构代码的builder
    "builder" : {
        "number": 2,
        "body" : [
            WORK, WORK, WORK, WORK, 
            CARRY, CARRY, 
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE,
        ],
        "cost" : 800,
    }, 

    "soldier" : {
        "number" : 1,
        "body" : [
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE,
        ],
        "cost" : 780,
    }
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
    // Memory.creeps['Guard00'].role = 'guard';
    //  测试代码区，每次保存执行一次
    if(testflag){
        testflag = false;

        build('globalPorter', 'GlobalPorter05');
    }


    // 自动SafeMode
    if(Game.spawns.Base.hits < Game.spawns.Base.hitsMax){
        var room = Game.rooms['E48S26'];
        if((!room.controller.safeMode) && (!room.controller.safeModeCooldown) && room.controller.safeModeAvailable){
            room.controller.activateSafeMode();
            console.log('开启Safe Mode')
            Memory.activateSafeMode++;
        }
    }

    // 防御塔
    runTower();
    
    //  记录死亡Creeps数
    var death = 0;
    for(name in Memory.creeps){
        // console.log("Doing respawn test:", name);

        //  临时（暂时的角色）
        if(!temp_roles.includes(Memory.creeps[name].role)){
            continue;
        }

        if(!Game.creeps[name]){
            death++;
        }
    }
    console.log("当前共有", death, "只creep死亡 | R.I.P.");
    
    for(name in Memory.creeps){
        // console.log("Doing respawn test:", name);
        if(!Game.creeps[name]){
            
            //  临时（暂时的角色）
            if(!temp_roles.includes(Memory.creeps[name].role)){
                continue;
            }

            console.log(name, "等待复活");
            //  将想要删除的creep，等待老死并删除Memory
            var killCreepName = ['', ''];
            if(!killCreepName.includes(name))
            {
                if(Game.spawns.Base.room.energyAvailable < creeps_roles[Memory.creeps[name].role]["cost"]){
                    console.log('生产能源不足！', Game.spawns.Base.room.energyAvailable, '/', creeps_roles[Memory.creeps[name].role]["cost"]);
                    break;
                }
                if(!Game.spawns.Base.spawning){
                    build(Memory.creeps[name].role, name);
                    break;
                }
            }
            else{
                console.log(name, "is died, deleting memory.");
                delete Memory.creeps[name];
            }
        }
    }
    

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(roles.includes(creep.memory.role)){
            var role = creep.memory.role
            var roleFunctionName = "role" + role.slice(0, 1).toUpperCase() + role.slice(1) + ".run(creep);";
            // console.log(roleFunctionName);
            eval(roleFunctionName);
            // console.log('各司其职', creep.name, role);
        }
        else{
            console.error(creep.name, 'has no job');
        }
    }
    //  数据收集
    stateScanner();
    /**
     * 全局统计信息扫描器
     * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
     */

    //  记录Spawn的生产时间占比
    Memory.stats.spawningTotalTime++;
    if(Game.spawns.Base.spawning) Memory.stats.spawnSpawningTime++;
    Memory.stats.deathCreepsNum = death;
}


