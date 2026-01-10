export function randomArray(arraySize: number, maxValue: number) {
  let highestValue = 0;

  const array = Array.from({ length: arraySize }, () => {
    const random = Math.random();
    const max = random * maxValue;
    const value = Math.floor(max);

    if (value > highestValue) {
      highestValue = value;
    }

    return { value: value, color: "red" };
  });

  return {
    array: array,
    highestValue: highestValue,
  };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}