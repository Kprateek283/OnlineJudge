import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateFilePaths = (language) => {
  const uuidpath = uuid(); // Generate a unique identifier
  let codeFile;
  let className;

  switch (language) {
    case 'c':
      codeFile = ".c";
      className = uuidpath; // Assuming C files don't require a specific class name
      break;
    case 'cpp':
      codeFile = ".cpp";
      className = uuidpath; // Assuming C++ files don't require a specific class name
      break;
    case 'python':
      codeFile = ".py";
      className = uuidpath; // Assuming Python files don't require a specific class name
      break;
    case 'java':
      codeFile = ".java";
      className = "Main"; // Specify the class name for Java files
      break;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }

  const codeFile1 = className + codeFile; // Concatenate class name and file extension
  const inputFile = "input.txt";
  const outputFile = "output.txt";
  const inputFile1 = uuidpath + inputFile; // Concatenate UUID and input file name
  const outputFile1 = uuidpath + outputFile; // Concatenate UUID and output file name

  const baseDir = path.join(__dirname, "./codes"); // Base directory where files will be stored

  const codePath = path.join(baseDir, codeFile1); // Full path to the code file
  const inputPath = path.join(baseDir, inputFile1); // Full path to the input file
  const outputPath = path.join(baseDir, outputFile1); // Full path to the output file

  return { codePath, inputPath, outputPath };
};

const ensureCodesDirectory = () => {
  const codesDir = path.join(__dirname, "./codes"); // Directory path to ./codes

  if (!fs.existsSync(codesDir)) {
    fs.mkdirSync(codesDir, { recursive: true }); // Create directory if it doesn't exist
    console.log(`Created directory: ${codesDir}`);
  }
};


export { generateFilePaths, ensureCodesDirectory };
