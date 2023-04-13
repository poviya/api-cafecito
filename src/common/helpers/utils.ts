import mongoose from 'mongoose';

export const validObjectId = (ID: string) => {
  if (mongoose.Types.ObjectId.isValid(ID)) {
    return true;
  } else {
    return false;
  }
};

export const sumDaysToDate = (days: number, date) => {
  /*
      var x = new Date();
      var y = new Date();

      console.log(new Date());
      var m = x.setDate(x.getDate() +days);
      var n = y.setDate(y.getDate() + 6);
      console.log(new Date(m));
      console.log(new Date(n));
      console.log( y > x);
      */
  const a = new Date(date);
  const m = a.setDate(a.getDate() + days);
  return m;
};

export const splitHastag = (str: string) => {
  const tags: string[] = [];
  const arr = str.split(' ');
  for (const item of arr) {
    // Regular expression to check if string is a hashtag
    const regexExp = /^#[^ !@#$%^&*(),.?":{}|<>]*$/gi;
    const checkIsvalid = regexExp.test(item);
    if (checkIsvalid) {
      const a = item.split('#');
      tags.push(a[1]);
    }
  }
  return tags;
}
