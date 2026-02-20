/**
 * Core Ranking logic
 */

export function computeRankings(participants, rounds, medalRules) {
    // 1. Compute totalWeighted for each participant
    //    totalWeighted = sum(score[roundId] * round.weight)
    const computedParticipants = participants.map(p => {
        let totalWeighted = 0;
        if (p.scores) {
            rounds.forEach(r => {
                const score = p.scores[r.id] || 0;
                const weight = r.weight !== undefined ? r.weight : 1;
                totalWeighted += (score * weight);
            });
        }
        return { ...p, totalWeighted };
    });

    // 2. Group by categoryId
    const byCategory = {};
    computedParticipants.forEach(p => {
        if (!byCategory[p.categoryId]) byCategory[p.categoryId] = [];
        byCategory[p.categoryId].push(p);
    });

    // 3 & 4. Sort within category by totalWeighted DESC and assign inCategory rank
    Object.keys(byCategory).forEach(catId => {
        const group = byCategory[catId];
        group.sort((a, b) => b.totalWeighted - a.totalWeighted);

        let currentRank = 1;
        for (let i = 0; i < group.length; i++) {
            if (i > 0 && group[i].totalWeighted < group[i - 1].totalWeighted) {
                currentRank = i + 1; // standard competition ranking, 1, 2, 2, 4
            }
            group[i].rank = { ...group[i].rank, inCategory: currentRank };
        }

        // 6. Apply medal rules per category
        if (medalRules) {
            applyMedals(group, medalRules);
        }
    });

    // 5. Sort all by totalWeighted DESC, assign overall rank
    computedParticipants.sort((a, b) => b.totalWeighted - a.totalWeighted);
    let overallRank = 1;
    for (let i = 0; i < computedParticipants.length; i++) {
        if (i > 0 && computedParticipants[i].totalWeighted < computedParticipants[i - 1].totalWeighted) {
            overallRank = i + 1;
        }
        computedParticipants[i].rank = { ...computedParticipants[i].rank, overall: overallRank };
    }

    return computedParticipants;
}

function applyMedals(categoryGroup, rules) {
    const { method, gold = 0, silver = 0, bronze = 0 } = rules;
    const total = categoryGroup.length;
    if (total === 0) return;

    let gCount, sCount, bCount;

    if (method === 'percentage') {
        gCount = Math.round(total * (gold / 100));
        sCount = Math.round(total * (silver / 100));
        bCount = Math.round(total * (bronze / 100));
    } else if (method === 'fixedCount') {
        gCount = gold;
        sCount = silver;
        bCount = bronze;
    } else {
        return;
    }

    let index = 0;

    // Function to assign medals considering ties (if someone with rank X gets Gold, all others tied at X also get Gold)
    const assignMedalTier = (medalName, countLimit) => {
        if (countLimit <= 0) return;
        const startRank = index < total ? categoryGroup[index].rank.inCategory : null;
        if (startRank === null) return;

        let assignedCount = 0;
        while (index < total) {
            const p = categoryGroup[index];
            // Keep assigning if we are under the limit, OR if they are tied with the last allowed internal rank
            if (assignedCount < countLimit || p.rank.inCategory === categoryGroup[index - 1].rank.inCategory) {
                p.medal = medalName;
                index++;
                assignedCount++;
            } else {
                break;
            }
        }
    };

    assignMedalTier('gold', gCount);
    assignMedalTier('silver', sCount);
    assignMedalTier('bronze', bCount);

    // set remainder to null
    while (index < total) {
        categoryGroup[index].medal = null;
        index++;
    }
}

export function computeAdvancements(participants, advancementRule) {
    if (!advancementRule) return participants;

    // Rule types: topN, topPercent, cutoffScore
    const { fromRound, method, value } = advancementRule;
    // Make a shallow copy and mark advancements
    return participants.map(p => {
        let advances = false;
        const score = p.scores && p.scores[fromRound] !== undefined ? p.scores[fromRound] : 0;

        // Simplistic handling for now based on cutoff map
        if (method === 'cutoffScore') {
            advances = score >= value;
        }
        // topN / topPercent would require grouping by category and sorting by `fromRound` score.

        return { ...p, advances };
    });
}
