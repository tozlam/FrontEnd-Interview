/*
238. 除自身以外数组的乘积

难度 中等

给你一个长度为 n 的整数数组 nums，其中 n > 1，返回输出数组 output ，其中 output[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。

示例:

    输入: [1,2,3,4]
    输出: [24,12,8,6]


提示：题目数据保证数组之中任意元素的全部前缀元素和后缀（甚至是整个数组）的乘积都在 32 位整数范围内。

说明: 请不要使用除法，且在 O(n) 时间复杂度内完成此题。

进阶：
你可以在常数空间复杂度内完成这个题目吗？（ 出于对空间复杂度分析的目的，输出数组不被视为额外空间。）
*/


// 优化方案:
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    const n = nums.length;
    let outputs = [];
    outputs[0] = 1;
    for (let i = 1; i < n; i++) {
        outputs[i] = outputs[i - 1] * nums[i - 1]; // 左边的乘积
    }
    let rightOutput = 1; // 右边的乘积
    for (let i = n - 1; i >= 0;i--) {
        outputs[i] = outputs[i] * rightOutput; // 左边的乘积×右边的乘积
        rightOutput = rightOutput * nums[i]; // 上一个数右边的乘积
    }
    return outputs;
};