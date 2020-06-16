var reverseDirectionTo = {
    1 : 5,
    2 : 6,
    3 : 7,
    4 : 8,
    5 : 1,
    6 : 2,
    7 : 3,
    8 : 4,
}

module.exports.roleSoldier = {
    targets : {
        '0' : {
            pos : new RoomPosition(16, 2, 'E48S26'),
            target_pos : new RoomPosition(1, 35, 'E48S25'),
        } ,
        '1' : {
            pos : new RoomPosition(47, 35, 'E48S25'),
            target_pos : new RoomPosition(1, 35, 'E49S25'),
        } ,
    },

    /** @param {Creep} creep */
    run : function (creep){
        //  获取id
        var id = creep.name.slice(-1);
        //  当前允许'0' ~ '9'共10个不同的分工
        if(id < '0' || id > '9'){
            id = '0';   //  默认分工为'0'号分工
        }

        /**
         * switch(id){
         *  0:  远程兵
         *  1： 近战战士
         *  2： 近战战士
         * }
         */

        //  自愈
        if(creep.id == '0' && creep.hits < hitsMax){
            console.log(creep.name, '自愈');
            creep.heal(creep);
        }

        if(creep.memory.fight && creep.hits <= 1700){
            creep.memory.fight = false;
        }
        if(!creep.memory.fight && creep.hits == creep.hitsMax){
            creep.memory.fight = true;
        }

        //  不在（安全房和战斗房）的房间 -> 前往的（安全房）
        if(creep.pos.roomName != this.targets[id].pos.roomName || this.targets[id].target_pos.roomName){
            creep.say("Move!");
            creep.moveTo(this.targets[id].pos, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
            return;
        } 
       
        //  战斗模式
        if(creep.memory.fight){
            //  不在（战斗房） -> 前往（战斗房）
            if(creep.pos.roomName != this.targets[id].target_pos.roomName){
                creep.say("Move!");
                creep.moveTo(this.targets[id].target_pos, {visualizePathStyle: {stroke: '#ffffff'},reusePath: 50});
                return;
            } 
            if(creep.id == '0'){
                var enemys = creep.room.find(FIND_HOSTILE_CREEPS);
                var enemyNum = enemys.length();
                var rangedEnemy = 0, normalEnemy = 0;
                for(i in enemys){
                    for(j in enemys[i].body){
                        if(enemys[i].body[j].type == 'ranged_attack'){
                            rangedEnemy++;
                            break;
                        }
                        if(enemys[i].body[j].type == 'attack'){
                            normalEnemy++;
                            break;
                        }
                    }
                }
                console.log(creep.name, 'found %d enemys.', enemyNum);
                console.log(creep.name, 'found %d rangedEnemy %d normalEnemy', rangedEnemy, normalEnemy);

                var clostestEnemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                var distance = creep.pos.getRangeTo(clostestEnemy);
                //  打得到
                if(distance <= 3){
                    creep.rangedAttack(clostestEnemy);
                    console.log(creep.name, 'ranged Attack', clostestEnemy.name);
                    creep.say('干你');
                }
                //  过近了
                if(distance < 3){
                    //  反方向移动
                    creep.move(reverseDirectionTo[creep.pos.getDirectionTo(clostestEnemy)]);
                    creep.say('走位');
                }
                //  太远了
                if(distance > 3){
                    creep.moveTo(clostestEnemy, {visualizePathStyle: {stroke: '#ffffff'}});
                    creep.say('追杀');
                }
            }
        }
        //  逃跑模式
        else{
            creep.moveTo(this.targets[id].pos, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}