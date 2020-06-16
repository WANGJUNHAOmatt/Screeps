module.exports = function () {
    /**
     *  防御塔 逻辑
     *  最后修改时间：2020/06/13
     *  治疗 -> 攻击 -> 维修 -> 刷墙
     */

    //  遍历房间
    for(var i in Game.rooms){
        var towers = Game.rooms[i].find(FIND_MY_STRUCTURES, {
            filter : (structure) => {
                return structure.structureType == STRUCTURE_TOWER
            }
        });
        //  遍历防御塔
        for(j in towers){
            //  寻找受伤的Creep
            var closestVictim = towers[j].pos.findClosestByRange(FIND_MY_CREEPS, {
                filter : (creep) => {
                    return creep.hits + 100 <= creep.hitsMax;
                }
            });
            if(closestVictim){
                console.log('治愈友军', closestVictim);
                towers[j].heal(closestVictim);
                continue;
            }

            //  有敌人优先攻击敌人
            var closestHostile = towers[j].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                console.log('攻击敌人', closestHostile);
                towers[j].attack(closestHostile);
                continue;
            }

            //  维修最近受损建筑
            var closestDamagedStructure = towers[j].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits + 200 < structure.hitsMax && 
                            structure.structureType != STRUCTURE_WALL &&
                            (structure.structureType == STRUCTURE_RAMPART &&
                                structure.hits < 100000))
                }
            });
            if(closestDamagedStructure) {
                towers[j].repair(closestDamagedStructure);
                continue;
            }

            //  新增：如果其他建筑都满血，就刷墙
            var structures = towers[j].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits + 200 < structure.hitsMax &&
                        structure.hits < 150000)
                }
            });
            structures.sort((a,b) => a.hits - b.hits);
            if(structures.length) {
                towers[j].repair(structures[0]);
                continue;
            }
        }
    }
}