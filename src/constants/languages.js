/**
 * Supported programming languages configuration
 * Each language includes ID, display label, and Monaco language identifier
 */
export const LANGUAGES = [
  { id: 'python', label: 'Python', monacoLang: 'python' },
  { id: 'cpp', label: 'C++', monacoLang: 'cpp' },
  { id: 'java', label: 'Java', monacoLang: 'java' },
  { id: 'javascript', label: 'JavaScript', monacoLang: 'javascript' },
]

/**
 * Default programming language
 */
export const DEFAULT_LANGUAGE = 'python'

/**
 * Default code templates for each language
 */
export const DEFAULT_CODE = {
  python: '# Write your Python code here\nprint("Hello, World!")',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
}
