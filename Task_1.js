function getAllCombinations(arr, n) {
    const sortedArr = arr.sort((a, b) => {return a - b})
    const allCombinations = []
    const singleCombination = []

    for (let i = 0; i < sortedArr.length; i++) {
        singleCombination.push(sortedArr[i])

        const elemsSummInSingleCombination = singleCombination.reduce((a, b) => a + b);

        if (elemsSummInSingleCombination === n) {
            allCombinations.push([...singleCombination]);
        } else if (elemsSummInSingleCombination > n) {
            singleCombination.pop()
            i = sortedArr.indexOf(singleCombination[singleCombination.length - 1])
            singleCombination.pop()
        }
    }
    return allCombinations
}
