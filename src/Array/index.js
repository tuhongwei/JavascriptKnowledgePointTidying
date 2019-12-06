/**
 * 数组中的一些操作
 */

 /**
  * 扁平化n维数组
  */

 // 1. ES10 flat方法
 // 2.
 Array.prototype.iFlat = function() {
   let arr = Array.prototype.slice.call(this);
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
