#!/usr/bin/env node

/**
 * SSS Studio DeepSeek Agentic Code AI
 * 
 * An autonomous coding agent (like Google Antigravity) powered by DeepSeek via NVIDIA NIM.
 * Capable of:
 * - Inspecting codebase files
 * - Writing & modifying code
 * - Running shell commands & builds
 * - Fixing errors in an autonomous loop
 * 
 * Usage:
 *   node deepseek-coder.mjs "Add a copyright notice in footer"
 *   node deepseek-coder.mjs
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import readline from "readline";
import OpenAI from "openai";

const API_KEY = process.env.NVIDIA_API_KEY || "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";

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const WORKSPACE_DIR = process.cwd();

// --- Coding Agent Tool Specifications ---
const CODING_TOOLS = [
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the full contents of a file in the workspace.",
      parameters: {
        type: "object",
        properties: {
          file_path: { type: "string", description: "Relative or absolute path to the file." },
        },
        required: ["file_path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Write or overwrite content to a file in the workspace.",
      parameters: {
        type: "object",
        properties: {
          file_path: { type: "string", description: "Relative or absolute path to the file." },
          content: { type: "string", description: "The complete new content of the file." },
        },
        required: ["file_path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_directory",
      description: "List files and subdirectories inside a directory.",
      parameters: {
        type: "object",
        properties: {
          dir_path: { type: "string", description: "Relative directory path (default '.')." },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_terminal_command",
      description: "Execute a command in the workspace shell (e.g. npm run build, git status).",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string", description: "Shell command line to execute." },
        },
        required: ["command"],
      },
    },
  },
];

// --- Tool Execution Logic ---
function executeCodingTool(name, args) {
  try {
    switch (name) {
      case "read_file": {
        const fullPath = path.resolve(WORKSPACE_DIR, args.file_path);
        if (!fs.existsSync(fullPath)) {
          return { error: `File not found: ${args.file_path}` };
        }
        const content = fs.readFileSync(fullPath, "utf-8");
        return { success: true, file_path: args.file_path, content };
      }

      case "write_file": {
        const fullPath = path.resolve(WORKSPACE_DIR, args.file_path);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, args.content, "utf-8");
        return { success: true, message: `Successfully updated ${args.file_path}` };
      }

      case "list_directory": {
        const fullPath = path.resolve(WORKSPACE_DIR, args.dir_path || ".");
        if (!fs.existsSync(fullPath)) {
          return { error: `Directory not found: ${args.dir_path}` };
        }
        const items = fs.readdirSync(fullPath).filter((f) => f !== "node_modules" && f !== ".next" && f !== ".git");
        return { directory: args.dir_path || ".", items };
      }

      case "run_terminal_command": {
        console.log(`\n  ⚡ [Agent Executing Command]: ${args.command}`);
        const output = execSync(args.command, {
          cwd: WORKSPACE_DIR,
          encoding: "utf-8",
          timeout: 45000,
        });
        return { command: args.command, output: output.slice(0, 4000) };
      }

      default:
        return { error: `Tool ${name} not recognized` };
    }
  } catch (err) {
    return { error: err.message || String(err), stderr: err.stderr?.toString() };
  }
}

// --- Agent Autonomous Loop ---
async function runCodingAgent(userTask) {
  console.log(`\n======================================================`);
  console.log(`🤖 DeepSeek Agentic Code AI (Powered by NVIDIA NIM)`);
  console.log(`🎯 Task: "${userTask}"`);
  console.log(`======================================================\n`);

  const messages = [
    {
      role: "system",
      content: `You are an expert Autonomous Coding Agent (like Google Antigravity) running inside a Next.js 16 project.
You have hands-on tools: read_file, write_file, list_directory, and run_terminal_command.
Your workflow:
1. Inspect the relevant files using read_file or list_directory.
2. Formulate the precise code changes and write them using write_file.
3. Test your changes by running 'npm run build' or relevant tests using run_terminal_command.
4. If an error occurs, analyze the error and fix it immediately.
5. When complete, provide a concise summary of what was accomplished.`,
    },
    { role: "user", content: userTask },
  ];

  let iterations = 0;
  const maxIterations = 8;

  while (iterations < maxIterations) {
    iterations++;
    console.log(`🔄 [Agent Step ${iterations}]: Thinking...`);

    const response = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-pro-0813",
      messages,
      tools: CODING_TOOLS,
      tool_choice: "auto",
      temperature: 0.2,
      max_tokens: 3000,
    });

    const msg = response.choices[0]?.message;
    if (!msg) break;

    messages.push(msg);

    // If agent replied with text
    if (msg.content) {
      console.log(`\n💬 [DeepSeek]:\n${msg.content}\n`);
    }

    // Check if tools were called
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      for (const toolCall of msg.tool_calls) {
        const fnName = toolCall.function.name;
        let fnArgs = {};
        try {
          fnArgs = JSON.parse(toolCall.function.arguments || "{}");
        } catch (e) {
          fnArgs = {};
        }

        console.log(`  🛠️  Tool Call: ${fnName}(${JSON.stringify(fnArgs)})`);
        const result = executeCodingTool(fnName, fnArgs);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: fnName,
          content: JSON.stringify(result),
        });
      }
    } else {
      // Agent finished its work
      console.log(`\n✅ [DeepSeek Agent]: Task complete!`);
      break;
    }
  }
}

// --- CLI Entrypoint ---
const inputTask = process.argv.slice(2).join(" ").trim();

if (inputTask) {
  runCodingAgent(inputTask).catch(console.error);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter coding task for DeepSeek Agent: ", (task) => {
    rl.close();
    if (task.trim()) {
      runCodingAgent(task.trim()).catch(console.error);
    }
  });
}
