const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./models/problem.model');
const connectDb = require('./config/mongo');

const premiumProblems = [
    {
        title: "1. Two Sum",
        difficulty: "Easy",
        description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <i>indices of the two numbers such that they add up to <code>target</code></i>.</p>
      <p>You may assume that each input would have <b><i>exactly</i> one solution</b>, and you may not use the <i>same</i> element twice.</p>
      <p>You can return the answer in any order.</p>

      <p><strong>Example 1:</strong></p>
      <pre>
<strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
      </pre>

      <p><strong>Example 2:</strong></p>
      <pre>
<strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]
      </pre>

      <p><strong>Example 3:</strong></p>
      <pre>
<strong>Input:</strong> nums = [3,3], target = 6
<strong>Output:</strong> [0,1]
      </pre>

      <p><strong>Constraints:</strong></p>
      <ul>
        <li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
        <li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
        <li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
        <li><strong>Only one valid answer exists.</strong></li>
      </ul>

      <p><strong>Follow-up:</strong> Can you come up with an algorithm that is less than <code>O(n<sup>2</sup>)</code> time complexity?</p>
    `,
        complexity: { time: "O(n)", space: "O(n)" },
        tags: ["Array", "Hash Table"],
        topics: ["Array", "Hash Table"],
        hints: [
            "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.",
            "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array keeping so that this search becomes faster?",
            "The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?"
        ],
        companies: ["Amazon", "Google", "Apple", "Adobe", "Microsoft", "Bloomberg"],
        accepted: 20905258,
        totalSubmissions: 36600000,
        acceptanceRate: 57.1,
        problemfunctionName: "twoSum",
        functionSignatures: [
            { language: "java", functionName: "twoSum", returnType: "int[]", parameters: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }] },
            { language: "cpp", functionName: "twoSum", returnType: "vector<int>", parameters: [{ name: "nums", type: "vector<int>&" }, { name: "target", type: "int" }] },
            { language: "python", functionName: "twoSum", returnType: "List[int]", parameters: [{ name: "nums", type: "List[int]" }, { name: "target", type: "int" }] },
            { language: "javascript", functionName: "twoSum", returnType: "number[]", parameters: [{ name: "nums", type: "number[]" }, { name: "target", type: "number" }] }
        ],
        BoilerPlate: [
            { language: "java", Boilercode: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}" },
            { language: "cpp", Boilercode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};" },
            { language: "python", Boilercode: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass" },
            { language: "javascript", Boilercode: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};" }
        ],
        visibleTestCases: [
            { input: "[2,7,11,15]\n9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "[3,2,4]\n6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
            { input: "[3,3]\n6", output: "[0,1]", explanation: "Both elements add up to the target." }
        ],
        invisibleTestCases: [
            { input: "[2,5,5,11]\n10", output: "[1,2]" },
            { input: "[-1,-2,-3,-4,-5]\n-8", output: "[2,4]" }
        ]
    },
    {
        title: "20. Valid Parentheses",
        difficulty: "Easy",
        description: `
      <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
      
      <p>An input string is valid if:</p>
      <ol>
        <li>Open brackets must be closed by the same type of brackets.</li>
        <li>Open brackets must be closed in the correct order.</li>
        <li>Every close bracket has a corresponding open bracket of the same type.</li>
      </ol>

      <p><strong>Example 1:</strong></p>
      <pre>
<strong>Input:</strong> s = "()"
<strong>Output:</strong> true
      </pre>

      <p><strong>Example 2:</strong></p>
      <pre>
<strong>Input:</strong> s = "()[]{}"
<strong>Output:</strong> true
      </pre>

      <p><strong>Example 3:</strong></p>
      <pre>
<strong>Input:</strong> s = "(]"
<strong>Output:</strong> false
      </pre>

      <p><strong>Constraints:</strong></p>
      <ul>
        <li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
        <li><code>s</code> consists of parentheses only <code>'()[]{}'</code>.</li>
      </ul>
    `,
        complexity: { time: "O(n)", space: "O(n)" },
        tags: ["String", "Stack"],
        topics: ["String", "Stack"],
        hints: [
            "Use a stack of characters.",
            "When you encounter an opening bracket, push it to the top of the stack.",
            "When you encounter a closing bracket, check if the top of the stack was the opening for it. If yes, pop it from the stack. Otherwise, return false."
        ],
        companies: ["Amazon", "LinkedIn", "Facebook", "Microsoft", "Bloomberg"],
        accepted: 9140232,
        totalSubmissions: 22800000,
        acceptanceRate: 39.9,
        problemfunctionName: "isValid",
        functionSignatures: [
            { language: "java", functionName: "isValid", returnType: "boolean", parameters: [{ name: "s", type: "String" }] },
            { language: "cpp", functionName: "isValid", returnType: "bool", parameters: [{ name: "s", type: "string" }] },
            { language: "python", functionName: "isValid", returnType: "bool", parameters: [{ name: "s", type: "str" }] },
            { language: "javascript", functionName: "isValid", returnType: "boolean", parameters: [{ name: "s", type: "string" }] }
        ],
        BoilerPlate: [
            { language: "java", Boilercode: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}" },
            { language: "cpp", Boilercode: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};" },
            { language: "python", Boilercode: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass" },
            { language: "javascript", Boilercode: "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};" }
        ],
        visibleTestCases: [
            { input: "\"()\"", output: "true", explanation: "Matching pair." },
            { input: "\"()[]{}\"", output: "true", explanation: "All matching pairs." },
            { input: "\"(]\"", output: "false", explanation: "Mismatched closing bracket." }
        ],
        invisibleTestCases: [
            { input: "\"((()))\"", output: "true" },
            { input: "\"[\"", output: "false" }
        ]
    },
    {
        title: "11. Container With Most Water",
        difficulty: "Medium",
        description: `
      <p>You are given an integer array <code>height</code> of length <code>n</code>. There are <code>n</code> vertical lines drawn such that the two endpoints of the <code>i<sup>th</sup></code> line are <code>(i, 0)</code> and <code>(i, height[i])</code>.</p>
      
      <p>Find two lines that together with the x-axis form a container, such that the container contains the most water.</p>
      
      <p>Return <i>the maximum amount of water a container can store</i>.</p>
      
      <p><strong>Notice</strong> that you may not slant the container.</p>

      <p><strong>Example 1:</strong></p>
      <pre>
<strong>Input:</strong> height = [1,8,6,2,5,4,8,3,7]
<strong>Output:</strong> 49
<strong>Explanation:</strong> The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.
      </pre>

      <p><strong>Example 2:</strong></p>
      <pre>
<strong>Input:</strong> height = [1,1]
<strong>Output:</strong> 1
      </pre>

      <p><strong>Constraints:</strong></p>
      <ul>
        <li><code>n == height.length</code></li>
        <li><code>2 &lt;= n &lt;= 10<sup>5</sup></code></li>
        <li><code>0 &lt;= height[i] &lt;= 10<sup>4</sup></code></li>
      </ul>
    `,
        complexity: { time: "O(n)", space: "O(1)" },
        tags: ["Array", "Two Pointers", "Greedy"],
        topics: ["Array", "Two Pointers", "Greedy"],
        hints: [
            "If you simulate the problem, it will be O(n^2) which is not efficient.",
            "Try to use two-pointers. Set one pointer to the left and one to the right of the array. Always move the pointer that points to the lower line."
        ],
        companies: ["Amazon", "Google", "Facebook", "Microsoft", "Bloomberg", "Apple"],
        accepted: 5123901,
        totalSubmissions: 9400000,
        acceptanceRate: 54.3,
        problemfunctionName: "maxArea",
        functionSignatures: [
            { language: "java", functionName: "maxArea", returnType: "int", parameters: [{ name: "height", type: "int[]" }] },
            { language: "cpp", functionName: "maxArea", returnType: "int", parameters: [{ name: "height", type: "vector<int>&" }] },
            { language: "python", functionName: "maxArea", returnType: "int", parameters: [{ name: "height", type: "List[int]" }] },
            { language: "javascript", functionName: "maxArea", returnType: "number", parameters: [{ name: "height", type: "number[]" }] }
        ],
        BoilerPlate: [
            { language: "java", Boilercode: "class Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}" },
            { language: "cpp", Boilercode: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};" },
            { language: "python", Boilercode: "class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass" },
            { language: "javascript", Boilercode: "/**\n * @param {number[]} height\n * @return {number}\n */\nvar maxArea = function(height) {\n    \n};" }
        ],
        visibleTestCases: [
            { input: "[1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Min height is 7, length is 7 => 49." },
            { input: "[1,1]", output: "1", explanation: "Min height 1, length 1." }
        ],
        invisibleTestCases: [
            { input: "[4,3,2,1,4]", output: "16" },
            { input: "[1,2,1]", output: "2" }
        ]
    },
    {
        title: "15. 3Sum",
        difficulty: "Medium",
        description: `
      <p>Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.</p>
      
      <p>Notice that the solution set must not contain duplicate triplets.</p>

      <p><strong>Example 1:</strong></p>
      <pre>
<strong>Input:</strong> nums = [-1,0,1,2,-1,-4]
<strong>Output:</strong> [[-1,-1,2],[-1,0,1]]
<strong>Explanation:</strong> 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
Note that the order of the output and the order of the triplets does not matter.
      </pre>

      <p><strong>Example 2:</strong></p>
      <pre>
<strong>Input:</strong> nums = [0,1,1]
<strong>Output:</strong> []
<strong>Explanation:</strong> The only possible triplet does not sum up to 0.
      </pre>

      <p><strong>Example 3:</strong></p>
      <pre>
<strong>Input:</strong> nums = [0,0,0]
<strong>Output:</strong> [[0,0,0]]
<strong>Explanation:</strong> The only possible triplet sums up to 0.
      </pre>

      <p><strong>Constraints:</strong></p>
      <ul>
        <li><code>3 &lt;= nums.length &lt;= 3000</code></li>
        <li><code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code></li>
      </ul>
    `,
        complexity: { time: "O(n^2)", space: "O(1) excluding sorting" },
        tags: ["Array", "Two Pointers", "Sorting"],
        topics: ["Array", "Two Pointers", "Sorting"],
        hints: [
            "So, we essentially need to find three numbers x, y, and z such that they add up to the given value.",
            "If we fix one of the numbers say x, we are left with the two-sum problem at hand!",
            "For the two-sum problem, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array keeping so that this search becomes faster?"
        ],
        companies: ["Amazon", "Uber", "Bloomberg", "Google", "Facebook"],
        accepted: 3912340,
        totalSubmissions: 11000000,
        acceptanceRate: 34.7,
        problemfunctionName: "threeSum",
        functionSignatures: [
            { language: "java", functionName: "threeSum", returnType: "List<List<Integer>>", parameters: [{ name: "nums", type: "int[]" }] },
            { language: "cpp", functionName: "threeSum", returnType: "vector<vector<int>>", parameters: [{ name: "nums", type: "vector<int>&" }] },
            { language: "python", functionName: "threeSum", returnType: "List[List[int]]", parameters: [{ name: "nums", type: "List[int]" }] },
            { language: "javascript", functionName: "threeSum", returnType: "number[][]", parameters: [{ name: "nums", type: "number[]" }] }
        ],
        BoilerPlate: [
            { language: "java", Boilercode: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        \n    }\n}" },
            { language: "cpp", Boilercode: "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};" },
            { language: "python", Boilercode: "class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        pass" },
            { language: "javascript", Boilercode: "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nvar threeSum = function(nums) {\n    \n};" }
        ],
        visibleTestCases: [
            { input: "[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Target is 0." },
            { input: "[0,1,1]", output: "[]", explanation: "No elements sum to 0." },
            { input: "[0,0,0]", output: "[[0,0,0]]", explanation: "Only zero elements." }
        ],
        invisibleTestCases: [
            { input: "[-2,0,1,1,2]", output: "[[-2,0,2],[-2,1,1]]" },
            { input: "[-1,0,1]", output: "[[-1,0,1]]" }
        ]
    },
    {
        title: "42. Trapping Rain Water",
        difficulty: "Hard",
        description: `
      <p>Given <code>n</code> non-negative integers representing an elevation map where the width of each bar is <code>1</code>, compute how much water it can trap after raining.</p>

      <p><strong>Example 1:</strong></p>
      <pre>
<strong>Input:</strong> height = [0,1,0,2,1,0,1,3,2,1,2,1]
<strong>Output:</strong> 6
<strong>Explanation:</strong> The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
      </pre>

      <p><strong>Example 2:</strong></p>
      <pre>
<strong>Input:</strong> height = [4,2,0,3,2,5]
<strong>Output:</strong> 9
      </pre>

      <p><strong>Constraints:</strong></p>
      <ul>
        <li><code>n == height.length</code></li>
        <li><code>1 &lt;= n &lt;= 2 * 10<sup>4</sup></code></li>
        <li><code>0 &lt;= height[i] &lt;= 10<sup>5</sup></code></li>
      </ul>
    `,
        complexity: { time: "O(n)", space: "O(1)" },
        tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
        topics: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
        hints: [
            "Instead of calculating area by height*width, we can think it in a cumulative way.",
            "For each element in the array, we find the maximum level of water it can trap after the rain."
        ],
        companies: ["Amazon", "Goldman Sachs", "Google", "Facebook", "Microsoft", "Bloomberg"],
        accepted: 2192134,
        totalSubmissions: 3500000,
        acceptanceRate: 61.2,
        problemfunctionName: "trap",
        functionSignatures: [
            { language: "java", functionName: "trap", returnType: "int", parameters: [{ name: "height", type: "int[]" }] },
            { language: "cpp", functionName: "trap", returnType: "int", parameters: [{ name: "height", type: "vector<int>&" }] },
            { language: "python", functionName: "trap", returnType: "int", parameters: [{ name: "height", type: "List[int]" }] },
            { language: "javascript", functionName: "trap", returnType: "number", parameters: [{ name: "height", type: "number[]" }] }
        ],
        BoilerPlate: [
            { language: "java", Boilercode: "class Solution {\n    public int trap(int[] height) {\n        \n    }\n}" },
            { language: "cpp", Boilercode: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};" },
            { language: "python", Boilercode: "class Solution:\n    def trap(self, height: List[int]) -> int:\n        pass" },
            { language: "javascript", Boilercode: "/**\n * @param {number[]} height\n * @return {number}\n */\nvar trap = function(height) {\n    \n};" }
        ],
        visibleTestCases: [
            { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Water trapped between peaks." },
            { input: "[4,2,0,3,2,5]", output: "9", explanation: "Water trapped between peaks 4 and 5." }
        ],
        invisibleTestCases: [
            { input: "[1,0,1]", output: "1" },
            { input: "[2,0,2]", output: "2" }
        ]
    }
];

const seedDB = async () => {
    try {
        await connectDb();
        console.log("Connected to MongoDB...");

        await Problem.deleteMany({});
        console.log("Cleared existing problems.");

        await Problem.insertMany(premiumProblems);
        console.log("Successfully seeded 5 premium problems!");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedDB();
