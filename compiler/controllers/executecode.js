import { exec } from "child_process";
import path from "path";

const executeCppCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  const outputExecutable = `${codePath}.out`;
  const compileCmd = `g++ ${codePath} -o ${outputExecutable}`;
  const runCmd = `${outputExecutable}${hasInput ? ` < ${inputPath}` : ""} > ${outputPath}`;
  exec(`${compileCmd} && ${runCmd}`, callback);
};

const executeCCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  const outputExecutable = `${codePath}.out`;
  const compileCmd = `gcc ${codePath} -o ${outputExecutable}`;
  const runCmd = `${outputExecutable}${hasInput ? ` < ${inputPath}` : ""} > ${outputPath}`;

  exec(`${compileCmd} && ${runCmd}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Compilation or execution error: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
      callback(error, null);
      return;
    }
    if (stderr) {
      console.error(`Standard Error: ${stderr}`);
      callback(new Error(stderr), null);
      return;
    }
    console.log(`Standard Output: ${stdout}`);
    callback(null, stdout);
  });
};

const executePythonCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  const runCmd = `python ${codePath}${hasInput ? ` < ${inputPath}` : ""} > ${outputPath}`;
  exec(runCmd, callback);
};

const executeJavaCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  const className = path.basename(codePath, '.java'); // Assuming the class name is the same as the file name
  const compileCmd = `javac ${codePath}`;
  const runCmd = `java -cp ${path.dirname(codePath)} ${className}${hasInput ? ` < ${inputPath}` : ''} > ${outputPath}`;

  exec(`${compileCmd} && ${runCmd}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during compilation or execution: ${error.message}`);
      callback(error, null);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      callback(new Error(stderr), null);
      return;
    }
    console.log(`stdout: ${stdout}`);
    callback(null, stdout);
  });
};

const executeCode = (language, codePath, inputPath, outputPath, hasInput, callback) => {
  switch (language) {
    case "cpp":
      executeCppCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    case "python":
      executePythonCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    case "java":
      executeJavaCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    case "c":
      executeCCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

export { executeCode };
