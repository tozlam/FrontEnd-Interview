/*
350. 两个数组的交集 II

难度简单

给定两个数组，编写一个函数来计算它们的交集。

示例 1:

输入: nums1 = [1,2,2,1], nums2 = [2,2]
输出: [2,2]
示例 2:

输入: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出: [4,9]
说明：

输出结果中每个元素出现的次数，应与元素在两个数组中出现的次数一致。
我们可以不考虑输出结果的顺序。
*/

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
    let map1 = mapCount(nums1);
    let map2 = mapCount(nums2);
    let result = [];
    for (let num of map1.keys()){
        let count1 = map1.get(num);
        let count2 = map2.get(num);
        let count = 0;
        if (count2) {
            count = Math.min(count1, count2);
        }
        if (count) {
            for (let i = 0; i < count; i++ ){
                result.push(num);
            }
        }
    }

    function mapCount(nums) {
        let map = new Map();
        for (let i = 0; i < nums.length; i++) {
            let num = nums[i];
            let count = map.get(num);
            if (count) {
                map.set(num, count + 1);
            } else {
                map.set(num, 1);
            }
        }
        return map;
    }
    return result;
};