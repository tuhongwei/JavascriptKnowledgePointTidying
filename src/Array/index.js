/**
 * 数组中的一些操作
 */

 /**
  * 扁平化n维数组
  */

 // 1. ES10 flat方法
 // 2.
 Array.prototype.iFlat = function(depth = 1) {
   let arr = Array.prototype.slice.call(this);
   if (depth === 0) return arr;
   return arr.reduce((acc, cur) => {
    if (Array.isArray(cur)) {
      return [...acc, ...cur.iFlat(depth - 1)];
    } else {
      return [...acc, cur];
    }
   }, []);
   while (arr.some(item => Array.isArray(item))) {
     arr = [].concat(...arr);
   }
   return arr;
 };

 /**
  * 去重
  */

 // 1. ES6 Set
 // Array.from(new Set(arr)) 或者 [...new Set(arr)]
 // 2.
 Array.prototype.iDistinct = function() {
   let arr = Array.prototype.slice.call(this);
   let result = [],
   i,
   j,
   len = arr.length;
   for(i = 0; i < len; i++) {
     for(j = i + 1; j < len; j++) {
       if (arr[i] === arr[j]) {
          j = ++i;
       }
     }
     result.push(arr[i]);
   }
   return result;
 };

 /* map实现
  *
  */
 // 1. for循环
 Array.prototype.iMap = function(fn, context) {
  let arr = Array.prototype.slice.call(this);
  let mappedArr = [];
  for(let i = 0; i < arr.length; i++) {
    // 判断是否为稀疏数组
    if (!arr.hasOwnProperty(i)) continue;
    mappedArr[i] = fn.call(context, arr[i], i, this);
  }
  return mappedArr;
 };
 // 2. reduce实现
 Array.prototype.iMap1 = function(fn, context) {
  let arr = Array.prototype.slice.call(this);
  return arr.reduce((pre, cur, index) => {
    return [...pre, fn.call(context, cur, index, this)];
  }, []);
 };
