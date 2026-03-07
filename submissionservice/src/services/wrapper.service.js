function generateWrapper(userCode, language, problem) {
    const lang = language.toLowerCase();

    if (lang === 'javascript' || lang === 'js') {
        return `
const fs = require("fs");

${userCode}

const rawInput = fs.readFileSync(0, "utf8").trim();

let args;
try {
    // Try splitting by newline first (standard way if inputs are on different lines)
    const lines = rawInput.split(/\\r?\\n/);
    args = lines.map(line => {
        try {
            return JSON.parse(line.trim());
        } catch (e) {
            return line.trim();
        }
    });
} catch (e) {
    // Fallback for single line or other formats
    try {
        args = JSON.parse("[" + rawInput + "]");
    } catch (err) {
        args = [rawInput];
    }
}

try {
    const output = ${problem.functionName}(...args);
    if (typeof output === 'string') {
        process.stdout.write(output);
    } else {
        process.stdout.write(JSON.stringify(output));
    }
} catch (err) {
    process.stderr.write(err.toString());
    process.exit(1);
}
`;
    }

    if (lang === 'python' || lang === 'py') {
        return `
import sys
import json

${userCode}

def solve():
    input_data = sys.stdin.read().strip().split('\\n')
    args = []
    for line in input_data:
        line = line.strip()
        if not line: continue
        try:
            args.append(json.loads(line))
        except:
            args.append(line)
    
    solution = Solution()
    result = solution.${problem.functionName}(*args)
    print(json.dumps(result))

if __name__ == "__main__":
    solve()
`;
    }

    if (lang === 'java') {
        const sig = problem.signature;
        const paramParsing = sig?.parameters?.map((p, i) => {
            const type = p.type.toLowerCase();
            if (type === 'int') return `int ${p.name} = Integer.parseInt(inputs[${i}].trim());`;
            if (type === 'string') return `String ${p.name} = inputs[${i}].trim().replace("\\"", "");`;
            if (type === 'boolean') return `boolean ${p.name} = Boolean.parseBoolean(inputs[${i}].trim());`;
            if (type === 'int[]') return `
                String[] items${i} = inputs[${i}].trim().replaceAll("[\\\\[\\\\] ]", "").split(",");
                int[] ${p.name} = new int[items${i}.length];
                for(int j=0; j<items${i}.length; j++) ${p.name}[j] = Integer.parseInt(items${i}[j]);
            `;
            return `String ${p.name} = inputs[${i}].trim(); // default to string for unknown types`;
        }).join('\n') || "";

        const paramNames = sig?.parameters?.map(p => p.name).join(', ') || "";

        return `
import java.util.*;
import java.io.*;

${userCode}

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        StringBuilder sb = new StringBuilder();
        while(sc.hasNextLine()) sb.append(sc.nextLine()).append("\\n");
        String[] inputs = sb.toString().trim().split("\\n");
        
        Solution sol = new Solution();
        ${paramParsing}
        
        Object result = sol.${problem.functionName}(${paramNames});
        if (result instanceof int[]) {
            System.out.print(Arrays.toString((int[])result).replace(" ", ""));
        } else if (result instanceof Object[]) {
            System.out.print(Arrays.deepToString((Object[])result).replace(" ", ""));
        } else {
            System.out.print(result);
        }
    }
}
`;
    }

    if (lang === 'cpp' || lang === 'c++') {
        const sig = problem.signature;
        const paramParsing = sig?.parameters?.map((p, i) => {
            const type = p.type.toLowerCase();
            if (type.includes('vector<int>')) return `vector<int> ${p.name} = parse_int_vector(inputs[${i}]);`;
            if (type.includes('int')) return `int ${p.name} = stoi(inputs[${i}]);`;
            if (type.includes('string')) return `string ${p.name} = inputs[${i}]; // basic string`;
            if (type.includes('bool')) return `bool ${p.name} = (inputs[${i}] == "true");`;
            return `string ${p.name} = inputs[${i}]; // fallback`;
        }).join('\n        ') || "";

        const paramNames = sig?.parameters?.map(p => p.name).join(', ') || "";
        const returnType = sig?.returnType || "void";

        return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

// Generic Parsers
vector<int> parse_int_vector(string s) {
    vector<int> res;
    size_t start = s.find('[');
    size_t end = s.find(']');
    if (start == string::npos || end == string::npos) return res;
    string inner = s.substr(start + 1, end - start - 1);
    stringstream ss(inner);
    string token;
    while (getline(ss, token, ',')) {
        if(!token.empty()) res.push_back(stoi(token));
    }
    return res;
}

${userCode}

int main() {
    string line;
    vector<string> inputs;
    while(getline(cin, line)) {
        if(!line.empty()) inputs.push_back(line);
    }
    
    Solution sol;
    try {
        ${paramParsing}
        
        ${returnType != 'void' ? 'auto result = ' : ''}sol.${problem.functionName}(${paramNames});
        
        ${returnType.includes('vector') ? `
            cout << "[";
            for(size_t i=0; i<result.size(); ++i) {
                cout << result[i] << (i == result.size()-1 ? "" : ",");
            }
            cout << "]";
        ` : 'cout << result;'}
    } catch (...) {
        return 1;
    }
    return 0;
}
`;
    }

    return userCode;
}

module.exports = { generateWrapper };
