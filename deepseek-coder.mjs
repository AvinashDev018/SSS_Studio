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

// Load environment variables from .env file if available
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
        if (key && value && !process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    });
  }
}
loadEnv();

const API_KEY = process.env.NVIDIA_API_KEY || process.env.DEEPSEEK_API_KEY || "dummy_key_placeholder";

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

  if (!process.env.NVIDIA_API_KEY && !process.env.DEEPSEEK_API_KEY) {
    console.error(`❌ Error: Neither NVIDIA_API_KEY nor DEEPSEEK_API_KEY is defined in your environment or .env file.`);
    console.error(`👉 Please add NVIDIA_API_KEY="nvapi-..." to your .env file or set it in your environment before running.`);
    return;
  }

  const messages = [
    {
      role: "system",
      content: `You are Antigravity-Coder, an elite Autonomous AI Coding Assistant powered by DeepSeek.
You operate directly inside the user's codebase with full tool capabilities:
- read_file: inspect source code and configuration files.
- write_file: apply clean, bug-free modifications or create new components.
- list_directory: explore project structure.
- run_terminal_command: test builds, check syntax, or query environment.

Instructions for your responses:
1. Always analyze user questions thoroughly. If the user asks an exploratory question (e.g., "Analyze the project which backend we can use"), inspect the relevant codebase files first, synthesize your technical analysis, and provide a clear, comprehensive, and well-structured markdown answer.
2. When performing code edits, inspect existing code patterns first, write complete production-grade code, and test your changes.
3. Keep your explanation concise, technical, and formatted in clean markdown.`,
    },
    { role: "user", content: userTask },
  ];

  let iterations = 0;
  const maxIterations = 15;

  while (iterations < maxIterations) {
    iterations++;
    console.log(`\n🔄 [Agent Step ${iterations}]: Thinking...`);

    const candidateModels = [
      "deepseek-ai/deepseek-r1",
      "meta/llama-3.3-70b-instruct",
      "nvidia/nemotron-3-super-120b-a12b"
    ];

    let response = null;
    let lastErr = null;

    for (const modelId of candidateModels) {
      try {
        response = await openai.chat.completions.create({
          model: modelId,
          messages,
          tools: CODING_TOOLS,
          tool_choice: "auto",
          temperature: 0.3,
          max_tokens: 2500,
        });
        if (response) break;
      } catch (err) {
        lastErr = err;
        continue;
      }
    }

    if (!response && lastErr) {
      throw lastErr;
    }

    const msg = response.choices[0]?.message;
    if (!msg) break;

    messages.push(msg);

    // If agent replied with text
    if (msg.content) {
      console.log(`\n💬 [DeepSeek Agent Output]:\n${msg.content}\n`);
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
      // Agent finished tool usage and gave final text response
      console.log(`\n✅ [DeepSeek Agent]: Task complete!`);
      break;
    }
  }

  // If the agent hit max iterations while doing tool calls, force a final text response turn
  const lastMsg = messages[messages.length - 1];
  if (lastMsg.role === "tool" || (lastMsg.role === "assistant" && !lastMsg.content)) {
    console.log(`\n📝 [DeepSeek Agent]: Generating final summary response...`);
    try {
      const finalSummary = await openai.chat.completions.create({
        model: "deepseek-ai/deepseek-r1",
        messages,
        temperature: 0.3,
        max_tokens: 2000,
      });
      const summaryText = finalSummary.choices[0]?.message?.content;
      if (summaryText) {
        console.log(`\n💬 [DeepSeek Agent Final Analysis]:\n${summaryText}\n`);
      }
    } catch (e) {
      // Fallback summary attempt
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
