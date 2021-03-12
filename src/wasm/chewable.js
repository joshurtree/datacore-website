// Based on Chewable C++'s STT Voyage Estimator
//  https://codepen.io/somnivore/pen/Nabyzw

export class ChewableEstimator {
    calculate(config) {
        // passed required parameters
        let ps = config.ps;
        let ss = config.ss;
        let o1 = config.others[0];
        let o2 = config.others[1];
        let o3 = config.others[2];
        let o4 = config.others[3];
        let startAm = config.startAm;

        // passed optional parameters
        let prof = config.prof ? config.prof : 20;

        let skillVariance

        // returned estimate
        let estimate = {};

        // output
        let numExtends = 2;
        let maxExtends = 100;
        let maxNum20hourSims = 100;

        // variables
        let ticksPerCycle = 28;
        let secondsPerTick = 20;
        let secondsInMinute = 60;
        let minutesInHour = 60;
        let hazardTick = 4;
        let rewardTick = 7;
        let hazardAsRewardTick = 28;
        let ticksPerMinute = secondsInMinute/secondsPerTick;
        let ticksPerHour = ticksPerMinute*minutesInHour;
        let cycleSeconds = ticksPerCycle*secondsPerTick;
        let cyclesPerHour = minutesInHour*secondsInMinute/cycleSeconds;
        let hazPerCycle = 6;
        let amPerActivity = 1;
        let activityPerCycle = 18;
        let hoursBetweenDilemmas = 2;
        let dilemmasPerHour = 1/hoursBetweenDilemmas;
        let ticksBetweenDilemmas = hoursBetweenDilemmas*minutesInHour*ticksPerMinute;
        let hazPerHour = hazPerCycle*cyclesPerHour-dilemmasPerHour;
        let hazSkillPerHour = 1260;
        let hazSkillPerTick = hazSkillPerHour/ticksPerHour; // 7
        let hazAmPass = 5;
        let hazAmFail = 30;
        let activityAmPerHour = activityPerCycle*cyclesPerHour*amPerActivity;
        let minPerHour = 60;
        let psChance = 0.35;
        let ssChance = 0.25;
        let osChance = 0.1;
        let skillChances = [psChance,ssChance,osChance,osChance,osChance,osChance];
        let dilPerMin = 5;

        // more input
        let currentAm = startAm; // ParseInt(document.getElementById("currentAm").value);
        let elapsedHours = 0; // ParseInt( document.getElementById("elapsedHours").value);
        let ship = currentAm; // ParseInt( document.getElementById("elapsedMinutes").value)/minPerHour;
        if (ship == 0)
            ship = startAm;

        let numSims = 5000; // ParseInt( document.getElementById("numSims").value);

        if (Math.min(ps,ss,o1,o2,o3,o4,ship) == 0) {
            ps = ss = 3000;
            o1 = o2 = o3 = o4 = 1000;
            ship = 1000;
            currentAm = 0;
            startAm = 500;
            elapsedHours = 0;
            numSims = 1000;
        }

        let num20hourSims = Math.min(maxNum20hourSims, numSims);

        //sizeUi();

        let hazSkillVariance = prof/100;
        let skills = [ps,ss,o1,o2,o3,o4];

        let elapsedHazSkill = elapsedHours*hazSkillPerHour;

        let maxSkill = Math.max(ps,ss,o1,o2,o3,o4);
        maxSkill = Math.max(0, maxSkill - elapsedHazSkill);
        let endVoySkill = maxSkill*(1+hazSkillVariance);

        let results = [];
        let resultsRefillCostTotal = [];
        for (var iExtend = 0; iExtend <= numExtends; ++iExtend) {
            results.push([]);
            results[iExtend].length = numSims;
            resultsRefillCostTotal.push(0);
        }

        //disableloops // temp

        let results20hrCostTotal = 0;
        let results20hrRefillsTotal = 0;

        for (var iSim = 0; iSim < numSims; iSim++) {
            let tick = Math.floor(elapsedHours*ticksPerHour);
            let am = ship;
            let refillCostTotal = 0;
            let extend = 0;

            while (0<1) {
                ++tick;
                // sanity escape:
                if (tick == 10000)
                    break;

                // hazard && not dilemma
                if (tick%hazardTick == 0
                    && tick%hazardAsRewardTick != 0
                    && tick%ticksBetweenDilemmas != 0)
                {
                    let hazDiff = tick*hazSkillPerTick;

                        // pick the skill
                    let skillPickRoll = Math.random();
                    let skill;
                    if (skillPickRoll < psChance) {
                    skill = ps;
                    } else if (skillPickRoll < psChance+ssChance) {
                    skill = ss;
                    } else {
                    skill = skills[2+this.randomInt(0,3)];
                    }

                    // check (roll if necessary)
                    let skillVar = hazSkillVariance*skill;
                    let skillMin = skill-skillVar;
                    if (hazDiff < skillMin) { // automatic success
                        am += hazAmPass;
                    } else {
                        let skillMax = skill+skillVar;
                        if (hazDiff >= skillMax) { // automatic fail
                            am -= hazAmFail;
                        } else { // roll for it
                            let skillRoll = this.randomRange(skillMin, skillMax);
                            //test.text += minSkill + "-" + maxSkill + "=" + skillRoll + " "
                            if (skillRoll >= hazDiff) {
                                am += hazAmPass;
                            } else {
                                am -= hazAmFail;
                            }
                        }
                    }
                } else if (tick%rewardTick != 0
                        && tick%hazardAsRewardTick != 0
                        && tick%ticksBetweenDilemmas != 0)
                {
                    am -= amPerActivity;
                }

                if (am <= 0) { // system failure
                    if (extend == maxExtends)
                        break;

                    let voyTime = tick/ticksPerHour;
                    let refillCost = Math.ceil(voyTime*60/dilPerMin);

                    if (extend <= numExtends) {
                        results[extend][iSim] = tick/ticksPerHour;
                        if (extend > 0) {
                            resultsRefillCostTotal[extend] += refillCostTotal;
                        }
                    }

                    am = startAm;
                    refillCostTotal += refillCost;
                    extend++;

                    if (voyTime > 20) {
                        results20hrCostTotal += refillCostTotal;
                        results20hrRefillsTotal += extend;
                        break;
                    }

                    if (extend > numExtends && iSim >= num20hourSims) {
                        break;
                    }
                } // system failure
            } // foreach tick
        } // foreach sim

        let refills = [];

        // calculate and display results
        for (var extend = 0; extend <= numExtends; ++extend) {
            let exResults = results[extend];

            exResults.sort(function(a,b){return a-b;});
            let voyTime = exResults[Math.floor(exResults.length/2)];

                // compute other results
            let safeTime = exResults[Math.floor(exResults.length/10)];
            let saferTime = exResults[Math.floor(exResults.length/100)];
            let safestTime = exResults[0];

            // compute last dilemma chance
            let lastDilemma = 0;
            let lastDilemmaFails = 0;
            for(var i = 0; i < exResults.length; i++) {
                let dilemma = Math.floor(exResults[i]/hoursBetweenDilemmas);
                if (dilemma > lastDilemma) {
                    lastDilemma = dilemma;
                    lastDilemmaFails = Math.max(0,i);
                }
            }

            let dilChance = Math.round(100*(exResults.length-lastDilemmaFails)/exResults.length);
            // HACK: if there is a tiny chance of the next dilemma, assume 100% chance of the previous one instead
            if (dilChance == 0) {
                lastDilemma--;
                dilChance = 100;
            }

            let refill = {
                'result': voyTime,
                'safeResult': safeTime,
                'saferResult': saferTime,
                'lastDil': lastDilemma*hoursBetweenDilemmas,
                'dilChance': dilChance,
                'refillCostResult': extend > 0 ? Math.ceil(resultsRefillCostTotal[extend]/numSims) : 0
            }
            refills.push(refill);

            //test.text = maxSkill*(1+hazSkillVariance)/hazSkillPerHour
            // the threshold here is just a guess
            if (maxSkill/hazSkillPerHour > voyTime) {
                let tp = Math.floor(voyTime*hazSkillPerHour);
                if (currentAm == 0) {
                    //setWarning(extend, "Your highest skill is too high by about " + Math.floor(maxSkill - voyTime*hazSkillPerHour) + ". To maximize voyage time, redistribute more like this: " + tp + "/" + tp + "/" + tp/4 + "/" + tp/4 + "/" + tp/4 + "/" + tp/4 + ".");
                }
            }
        } // foreach extend

        estimate['refills'] = refills;

        // calculate 20hr results
        estimate['20hrdil'] = Math.ceil(results20hrCostTotal/num20hourSims);
        estimate['20hrrefills'] = Math.round(results20hrRefillsTotal/num20hourSims);

        return estimate;
    }

    randomInt(min, max) {
        return Math.min(max, min + Math.floor(Math.random()*(max-min+1)));
    }

    randomRange(min, max) {
        return min + Math.random()*(max-min);
    }
}

export default ChewableEstimator;
