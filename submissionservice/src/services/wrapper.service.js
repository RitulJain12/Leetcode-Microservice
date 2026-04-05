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
            if (type === 'string') return `String ${p.name} = parseString(inputs[${i}]);`;
            if (type === 'boolean') return `boolean ${p.name} = Boolean.parseBoolean(inputs[${i}].trim());`;
            if (type === 'double') return `double ${p.name} = Double.parseDouble(inputs[${i}].trim());`;
            if (type === 'long') return `long ${p.name} = Long.parseLong(inputs[${i}].trim());`;
            if (type === 'int[]') return `int[] ${p.name} = parseIntArray(inputs[${i}]);`;
            if (type === 'string[]') return `String[] ${p.name} = parseStringArray(inputs[${i}]);`;
            if (type === 'int[][]') return `int[][] ${p.name} = parse2DIntArray(inputs[${i}]);`;
            return `String ${p.name} = inputs[${i}].trim(); // fallback`;
        }).join('\n        ') || "";

        const paramNames = sig?.parameters?.map(p => p.name).join(', ') || "";

        return `
import java.util.*;
import java.io.*;

${userCode}

public class Main {
    public static String parseString(String s) {
        s = s.trim();
        if(s.startsWith("\\"") && s.endsWith("\\"")) return s.substring(1, s.length()-1);
        return s;
    }
    public static String[] splitArrayElements(String s) {
        s = s.trim();
        if(s.length() <= 2) return new String[0];
        s = s.substring(1, s.length()-1);
        List<String> list = new ArrayList<>();
        int depth = 0;
        boolean inQuotes = false;
        StringBuilder sb = new StringBuilder();
        for(int i=0; i<s.length(); i++) {
            char c = s.charAt(i);
            if(c == '"') inQuotes = !inQuotes;
            else if(c == '[' && !inQuotes) depth++;
            else if(c == ']' && !inQuotes) depth--;
            
            if(c == ',' && depth == 0 && !inQuotes) {
                list.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        list.add(sb.toString().trim());
        return list.toArray(new String[0]);
    }
    public static int[] parseIntArray(String s) {
        String[] parts = splitArrayElements(s);
        int[] arr = new int[parts.length];
        for(int i=0; i<parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim());
        return arr;
    }
    public static String[] parseStringArray(String s) {
        String[] parts = splitArrayElements(s);
        String[] arr = new String[parts.length];
        for(int i=0; i<parts.length; i++) arr[i] = parseString(parts[i]);
        return arr;
    }
    public static int[][] parse2DIntArray(String s) {
        String[] parts = splitArrayElements(s);
        int[][] arr = new int[parts.length][];
        for(int i=0; i<parts.length; i++) arr[i] = parseIntArray(parts[i]);
        return arr;
    }

    public static void printResult(Object result) {
        if (result instanceof int[]) {
            System.out.print(Arrays.toString((int[])result).replace(" ", ""));
        } else if (result instanceof int[][]) {
            int[][] res = (int[][]) result;
            System.out.print("[");
            for(int i=0; i<res.length; i++) {
                System.out.print(Arrays.toString(res[i]).replace(" ", ""));
                if(i < res.length - 1) System.out.print(",");
            }
            System.out.print("]");
        } else if (result instanceof String[]) {
            String[] res = (String[]) result;
            System.out.print("[");
            for(int i=0; i<res.length; i++) {
                System.out.print("\\"" + res[i] + "\\"");
                if(i < res.length - 1) System.out.print(",");
            }
            System.out.print("]");
        } else if (result instanceof Object[]) {
            System.out.print(Arrays.deepToString((Object[])result).replace(" ", ""));
        } else {
            System.out.print(result);
        }
    }

    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        StringBuilder sb = new StringBuilder();
        while(sc.hasNextLine()) sb.append(sc.nextLine()).append("\\n");
        String[] inputs = sb.toString().trim().split("\\n");
        
        Solution sol = new Solution();
        ${paramParsing}
        
        Object result = sol.${problem.functionName}(${paramNames});
        printResult(result);
    }
}
`;
    }

    if (lang === 'cpp' || lang === 'c++') {
        const sig = problem.signature;
        const paramParsing = sig?.parameters?.map((p, i) => {
            const type = p.type.toLowerCase();
            if (type.includes('vector<vector<int>>')) return `vector < vector < int >> ${p.name} = parse_2d_int_vector(inputs[${i}]); `;
            if (type.includes('vector<int>')) return `vector < int > ${p.name} = parse_int_vector(inputs[${i}]); `;
            if (type.includes('vector<string>')) return `vector < string > ${p.name} = parse_string_vector(inputs[${i}]); `;
            if (type.includes('string')) return `string ${p.name} = parse_string(inputs[${i}]); `;
            if (type.includes('bool')) return `bool ${p.name} = (inputs[${i}] == "true" || inputs[${i}] == "1"); `;
            if (type.includes('double')) return `double ${p.name} = stod(inputs[${i}]); `;
            if (type.includes('float')) return `float ${p.name} = stof(inputs[${i}]); `;
            if (type.includes('long')) return `long long ${p.name} = stoll(inputs[${i}]); `;
            if (type.includes('int')) return `int ${p.name} = stoi(inputs[${i}]); `;
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
#include <stack>
#include <queue>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <type_traits>

using namespace std;

// Generic Parsers
string parse_string(string s) {
    size_t start = s.find_first_not_of(" \\n\\r\\t");
    if(start == string::npos) return "";
    size_t end = s.find_last_not_of(" \\n\\r\\t");
    s = s.substr(start, end - start + 1);
    if(s.size() >= 2 && s.front() == '"' && s.back() == '"') return s.substr(1, s.size()-2);
    return s;
}

vector<string> split_array_elements(string s) {
    vector<string> res;
    size_t start = s.find('[');
    size_t end = s.rfind(']');
    if (start == string::npos || end == string::npos) return res;
    string inner = s.substr(start + 1, end - start - 1);
    if(inner.empty()) return res;
    int depth = 0;
    bool inQuotes = false;
    string token;
    for(size_t i=0; i<inner.size(); i++) {
        char c = inner[i];
        if(c == '"') inQuotes = !inQuotes;
        else if(c == '[' && !inQuotes) depth++;
        else if(c == ']' && !inQuotes) depth--;
        
        if(c == ',' && depth == 0 && !inQuotes) {
            res.push_back(token);
            token.clear();
        } else {
            token += c;
        }
    }
    res.push_back(token);
    return res;
}

vector<int> parse_int_vector(string s) {
    vector<string> parts = split_array_elements(s);
    vector<int> res;
    for(auto& p : parts) {
        p.erase(remove(p.begin(), p.end(), ' '), p.end());
        if(!p.empty()) res.push_back(stoi(p));
    }
    return res;
}

vector<string> parse_string_vector(string s) {
    vector<string> parts = split_array_elements(s);
    vector<string> res;
    for(auto& p : parts) res.push_back(parse_string(p));
    return res;
}

vector<vector<int>> parse_2d_int_vector(string s) {
    vector<string> parts = split_array_elements(s);
    vector<vector<int>> res;
    for(auto& p : parts) res.push_back(parse_int_vector(p));
    return res;
}

void print_element(const string& val) { cout << "\\"" << val << "\\""; }
void print_element(bool val) { cout << (val ? "true" : "false"); }
template<typename T> void print_element(const T& val) { cout << val; }
template<typename T> void print_element(const vector<T>& vec);

template<typename T>
void print_element(const vector<T>& vec) {
    cout << "[";
    for(size_t i=0; i<vec.size(); ++i) {
        print_element(vec[i]);
        if(i != vec.size() - 1) cout << ",";
    }
    cout << "]";
}

// Top level unquoted wrappers
void print_result(const string& val) { cout << val; }
void print_result(bool val) { cout << (val ? "true" : "false"); }
template<typename T> void print_result(const T& val) { print_element(val); }

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
        ${returnType != 'void' ? 'print_result(result);' : ''}
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
