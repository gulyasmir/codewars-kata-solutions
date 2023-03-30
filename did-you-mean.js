function Dictionary(words) {
    this.words = words;
  }
  
  Dictionary.prototype.findMostSimilar = function(term) {
     const reduced = this.words.reduce(
      (acc, word, index) => {
        const distan = distance(term, word);
        if (distan < acc.distance) {
          acc.distance = distan;
          acc.index = index;
          return acc;
        }
        if (acc.index === -1) {
          acc.distance = distan;
          acc.index = index;
        }
        return acc;
      },
      { distance: 0, index: -1 }
    );
    return this.words[reduced.index];
  }
  
  const getDistance = (termArray, wordArray) => {
    const out = {
      distance: 0,
      outArray: [],
      deleted: 0,
      added: 0,
      replaced: 0,
    };
    const indexesFromTerm = new Array(termArray.length).fill({
      replaced: false,
    });
    wordArray.forEach((w, index) => {
      if (termArray[index] === w) {
        out.outArray[index] = w;
      } else if (
        termArray.indexOf(w) !== -1 &&
        !indexesFromTerm[termArray.indexOf(w)].replaced
      ) {
        out.outArray[index] = w;
        out.distance++;
        out.replaced++;
        indexesFromTerm[termArray.indexOf(w)] = { replaced: true };
        termArray[termArray.indexOf(w)] = undefined;
      } else {
        if (termArray.length < index + 1) {
          out.outArray[index] = w;
          out.distance++;
          out.added++;
        } else {
          out.outArray[index] = w;
          out.distance += 2;
          out.added++;
          out.deleted++;
          if (termArray[index] === "1") {
            out.deleted--;
            out.distance--;
          }
        }
      }
    });
    const excedDistance = termArray.length - wordArray.length;
    out.distance =
      excedDistance > 0 ? out.distance + excedDistance : out.distance;
    out.deleted = excedDistance > 0 ? out.deleted + excedDistance : out.deleted;
    return out;
  };
  
  const distance = (term, word) => {
    const [termArray, wordArray] = prepare(term, word);
  
    const numberOnes = termArray.filter((e) => e === "1");
    let termRotated = termArray;
  
    const betterTerm = numberOnes.reduce(
      (acc) => {
        const coincidences = countCoincidences(termRotated, wordArray);
        if (acc.coincidences < coincidences) {
          return {
            coincidences,
            termArray: termRotated,
            wordArray,
          };
        }
        termRotated = rotate(termRotated);
        return acc;
      },
      { coincidences: 0, termArray, wordArray }
    );
    return getDistance(betterTerm.termArray, wordArray).distance;
  };
  
  const prepare = (term, word) => {
    const termArray = term.split("");
    const wordArray = word.split("");
  
    if (termArray.length > wordArray.length) {
      const fill = new Array(termArray.length - wordArray.length).fill("1");
      wordArray.push(...fill);
      return [wordArray, termArray];
    } else {
      const fill = new Array(wordArray.length - termArray.length).fill("1");
      termArray.push(...fill);
      return [termArray, wordArray];
    }
  };
  const rotate = (array) => {
    return array.reduce((acc, val, index) => {
      if (index === array.length - 1) {
        acc[0] = val;
      } else {
        acc[index + 1] = val;
      }
      return acc;
    }, []);
  };
  
  const countCoincidences = (arr1, arr2) => {
    return arr1.reduce((acc, e, index) => {
      if (arr2[index] === e) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };