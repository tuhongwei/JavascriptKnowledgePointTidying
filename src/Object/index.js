/**
 * Object中的一些操作
 */

 /**
  * Object.is的polyfill
  * Object.is() 和 === 的区别是
  * Object.is(0, -0)返回false, Object.is(NaN, NaN)返回true
  */
 if (!Object.is) {
   Object.is = function(x, y) {
     if (x === y) {
       return x !== 0 || 1 / x === 1 / y;
     } else {
       return x !== x && y !== y;
     }
   }
 }

