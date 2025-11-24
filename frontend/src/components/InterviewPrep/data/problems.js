export const problems = [
    {
        id: "loop-a-to-z",
        title: "Loop A to Z",
        description: "Generate the English uppercase alphabet from A to Z using loops.",
        difficulty: "Easy",
        tags: ["JavaScript", "Loops", "Arrays"],
        companies: ["Accenture", "TCS", "Infosys", "Capgemini", "Wipro"],
        timeEstimate: "5 mins",
        statement: "Write a function generateAtoZ() that returns an array of 26 strings representing the letters A through Z in order.",
        examples: [
            {
                input: "none",
                output: '["A", "B", "C", ..., "Z"]',
            },
        ],
        constraints: [
            "Use a loop-based approach (e.g., for or while).",
            "Output must be an array of exactly 26 single-character uppercase strings.",
            "No input arguments are required.",
        ],
        starterCode: `function generateAtoZ() {
  // your solution here
}

module.exports = { generateAtoZ };`,
    },
    {
        id: "find-smallest-number",
        title: "Find smallest number",
        description: "Determine the smallest (minimum) number present in a given array of numbers.",
        difficulty: "Easy",
        tags: ["JavaScript", "Arrays", "Math"],
        companies: ["Accenture", "Capgemini", "TCS", "Infosys", "Wipro", "Tech Mahindra"],
        timeEstimate: "10 mins",
        statement: "Write a function findSmallest(arr) that takes an array of numbers and returns the smallest number in the array.",
        examples: [
            {
                input: "[5, 2, 9, 1, 7]",
                output: "1",
            },
            {
                input: "[-3, -1, -7, -2]",
                output: "-7",
            },
        ],
        constraints: [
            "Array will contain at least one number.",
            "Array can contain negative numbers.",
            "Return the minimum value found.",
        ],
        starterCode: `function findSmallest(arr) {
  // your solution here
}

module.exports = { findSmallest };`,
    },
    {
        id: "custom-sort",
        title: "Custom Sort",
        description: "Write a function that takes an array containing a mix of characters and numbers and returns a sorted array",
        difficulty: "Easy",
        tags: ["JavaScript", "Sorting", "Arrays"],
        companies: ["Amazon", "Slack"],
        timeEstimate: "20 mins",
        statement: "Create a custom sorting function that sorts an array containing both numbers and strings. Numbers should come first (sorted ascending), followed by strings (sorted alphabetically).",
        examples: [
            {
                input: "[5, 'apple', 2, 'zebra', 9, 'banana']",
                output: "[2, 5, 9, 'apple', 'banana', 'zebra']",
            },
        ],
        constraints: [
            "Handle both numbers and strings in the array.",
            "Numbers should be sorted in ascending order.",
            "Strings should be sorted alphabetically (case-insensitive).",
        ],
        starterCode: `function customSort(arr) {
  // your solution here
}

module.exports = { customSort };`,
    },
    {
        id: "count-even-numbers",
        title: "Count even numbers",
        description: "Determine how many even integers are present in a given array of numbers.",
        difficulty: "Easy",
        tags: ["JavaScript", "Arrays", "Math"],
        companies: ["Accenture", "TCS", "Wipro", "Infosys", "Capgemini"],
        timeEstimate: "5 mins",
        statement: "Write a function countEven(arr) that takes an array of integers and returns the count of even numbers.",
        examples: [
            {
                input: "[1, 2, 3, 4, 5, 6]",
                output: "3",
                explanation: "2, 4, and 6 are even",
            },
        ],
        constraints: [
            "Array can be empty (return 0).",
            "Only count integers that are divisible by 2.",
        ],
        starterCode: `function countEven(arr) {
  // your solution here
}

module.exports = { countEven };`,
    },
    {
        id: "secret-code-shuffler",
        title: "Secret Code Shuffler",
        description: "Decode a secret message by applying character shifts based on a specific encoding pattern.",
        difficulty: "Easy",
        tags: ["JavaScript", "Strings", "Algorithms"],
        companies: ["Netflix", "LinkedIn", "Adobe", "Spotify"],
        timeEstimate: "20 mins",
        statement: "Create a function that decodes a secret message by shifting each character by a specified amount.",
        examples: [
            {
                input: "message: 'Khoor', shift: 3",
                output: "'Hello'",
                explanation: "Each character is shifted back by 3 positions",
            },
        ],
        constraints: [
            "Handle both uppercase and lowercase letters.",
            "Non-alphabetic characters should remain unchanged.",
            "Wrap around the alphabet if necessary.",
        ],
        starterCode: `function decodeMessage(message, shift) {
  // your solution here
}

module.exports = { decodeMessage };`,
    },
    {
        id: "group-by-key",
        title: "groupBy(arr, key)",
        description: "Group objects in an array by a property",
        difficulty: "Easy",
        tags: ["JavaScript", "Arrays", "Objects"],
        companies: ["Google", "Salesforce", "Flipkart"],
        timeEstimate: "5 mins",
        statement: "Write a function groupBy(arr, key) that groups an array of objects by a specified property key.",
        examples: [
            {
                input: "([{type: 'fruit', name: 'apple'}, {type: 'fruit', name: 'banana'}], 'type')",
                output: "{fruit: [{type: 'fruit', name: 'apple'}, {type: 'fruit', name: 'banana'}]}",
            },
        ],
        constraints: [
            "Return an object where keys are the unique values of the specified property.",
            "Each key should map to an array of objects with that property value.",
        ],
        starterCode: `function groupBy(arr, key) {
  // your solution here
}

module.exports = { groupBy };`,
    },
    {
        id: "flatten-nested-array",
        title: "Flatten Nested Array",
        description: "Create a function that takes a nested array of arbitrary depth and returns a flattened array",
        difficulty: "Medium",
        tags: ["JavaScript", "Recursion", "Arrays"],
        companies: ["Microsoft", "Ola"],
        timeEstimate: "10 mins",
        statement: "Write a function flatten(arr) that takes a nested array and returns a single flat array with all elements.",
        examples: [
            {
                input: "[1, [2, [3, [4]], 5]]",
                output: "[1, 2, 3, 4, 5]",
            },
        ],
        constraints: [
            "Handle arrays nested to any depth.",
            "Preserve the order of elements.",
            "Don't use Array.flat().",
        ],
        starterCode: `function flatten(arr) {
  // your solution here
}

module.exports = { flatten };`,
    },
];
