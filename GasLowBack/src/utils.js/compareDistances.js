function compareDistances(gasoline, distB) {
  if (distA < distB) {
    return -1;
  } else if (distA > distB) {
    return 1;
  } else {
    return 0;
  }
}

export default compareDistances; 