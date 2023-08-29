function sostavChisla(massivChisel, chilso) {
    const allCombinations = [];
    for (let i = 0; i < massivChisel.length; i++) {
        if (massivChisel[i] === chilso) {
            allCombinations.push([massivChisel[i]])
            massivChisel.splice(i, 1)
        } else if (massivChisel[i] > chilso) {
            massivChisel.splice(i, 1)
        }
    }

    function backtrack(combination, index) {
        if (combination.reduce((a, b) => a + b, 0) === chilso) {
            allCombinations.push([...combination]);
            return;
        }
        for (let i = index; i < massivChisel.length; i++) {
            combination.push(massivChisel[i]);
            backtrack(combination, i + 1);
            combination.pop();
        }
    }
    backtrack([], 0);
    return allCombinations;
}
