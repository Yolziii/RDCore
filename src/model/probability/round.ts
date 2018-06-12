export const round = function(probability:number, accuracy = 4):number {
    let multiplier = 10;
    for (let i = 1; i< accuracy; i++) {
        multiplier *= 10;
    }

    return Math.round(probability * multiplier)/multiplier;
};
