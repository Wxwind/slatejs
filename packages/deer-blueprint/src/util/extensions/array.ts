export const pushUnique = <T>(array: T[], expand: T[]) => {
  for (var i = 0; i < expand.length; i++) {
    var ele = expand[i];
    if (array.indexOf(ele) == -1) {
      array.push(ele);
    }
  }
};
