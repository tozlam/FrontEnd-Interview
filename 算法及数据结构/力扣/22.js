/*
22. 括号生成

难度： 中等

数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

示例：

输入：n = 3
输出：[
    "((()))",
    "(()())",
    "(())()",
    "()(())",
    "()()()"
]*/

/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    let res = [];

    /**
     * @param {
     *      leftRemain: 左括号剩余数量
     *      rightRemain: 右括号剩余数量
     *      str: 当前字符串
     * }
     */
    function dfs(leftRemain, rightRemain, str) {

        // 出口
        if (leftRemain === 0 && rightRemain === 0) {
            res.push(str);
            return;
        }

        // 限制条件1
        if (leftRemain > 0) {
            dfs(leftRemain - 1, rightRemain, str + '(');
        }

        // 限制条件2
        if (leftRemain < rightRemain) {
            dfs(leftRemain, rightRemain - 1, str + ')');
        }

        return;
    }

    dfs(n, n, ''); // 初始str是个空字符串

    return res;
};