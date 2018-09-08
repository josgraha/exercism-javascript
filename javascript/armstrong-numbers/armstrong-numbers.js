export const validate = num => {
  if (isNaN(num)) {
    return false;
  }
  const numberAsString = `${num}`;
  const expoonent = numberAsString.length;
  const product = numberAsString.split("").reduce(
    (result, digit) => result + Math.pow(
      parseInt(digit), expoonent), 0);
  return num === product;
}