---
type: research
title: "How agents connect to document tools today"
date: 2026-11-26
ticket: 40
---

# How agents connect to document tools today

Research note for ticket #40. It gathers facts for the "Agent access" decision (ticket #45). It does not recommend an architecture or a tech stack.

## How to read this note

- **Date checked:** every source was opened on 26 November 2026.
- **Sources:** official protocol specifications and each vendor's own documentation. A source key such as [M3] links to the page that was opened. The full list is at the end.
- **"Inferred"** marks a conclusion drawn from the sources rather than read in them.
- **"Not found"** means the pages opened did not say it. It does not mean the feature is absent.
- **Method limit:** pages were read through a fetch tool that extracts text, so this note paraphrases and does not quote. The claims the tables depend on most were opened a second time and checked: the MCP specification pages, Claude custom connectors, ChatGPT custom MCP, the Codex MCP page, Gemini custom apps, Claude Docs, the Notion comment and suggested-edit tools, Obsidian Connectors and Chrome's WebMCP page.
- **Terms:** an *agent* is the AI application that calls tools (the MCP "client" or "host"). A *tool* is the program that offers documents (the MCP "server").

## 1. Short answers

1. **One protocol dominates agent-to-tool connections: the Model Context Protocol (MCP).** Every main agent in this note is an MCP client on at least one of its surfaces. [M1] [A2] [O1] [G1] [C1] [H1]
2. **MCP has two standard transports.** With *stdio* the agent starts the tool as a program on the same machine. With *Streamable HTTP* the tool is an HTTP endpoint the agent calls. [M10]
3. **The split that matters is where the agent runs, not which vendor made it.** Agents that run on the user's machine (desktop apps, editors, command-line agents) can use local and remote tools. Agents that run in the vendor's cloud (Claude on the web and mobile, ChatGPT on the web, the Gemini app) can only reach a tool at a public internet address. [A1] [O1] [G1]
4. **With no network, only an agent that runs a local model can work at all.** The local route (stdio, or plain files) needs no network on the tool's side, but the agent still needs a model. Claude Code and Cursor are documented as tied to their vendor's models or servers, and the Claude, ChatGPT and Gemini chat apps are cloud services (inferred). [A11] [C5] [L3]
5. **A browser-only web app cannot be a local MCP server.** A web page cannot be started as a program and cannot accept incoming connections, and its storage is not visible to other programs. Its routes are: real files through the File System Access API (Chromium only), tools offered to an agent inside the browser (WebMCP, in trial), a browser agent that operates the page, or a hosted endpoint. [W1] [W5] [W7] [W10]
6. **Comparable tools use three patterns:** plain files plus an instructions file or skills (Obsidian, Tolaria), a local server (Anytype, Tolaria, an Obsidian community plug-in), and a hosted connector (Notion, Claude Docs). [B1] [B3] [Y1] [T3] [N1] [A13]
7. **Partial reads, guarded edits, suggestions, comments and agent identity are not part of MCP.** Each tool designs them as its own MCP tools or API calls (inferred from [M1] and [M6]). Progress reporting is in the core protocol; being woken by an outside event is an extension in beta. [M7] [M8]

## 2. Open protocols in real use

| Protocol | What it connects | How it travels | Status and governance | Sources |
|---|---|---|---|---|
| **Model Context Protocol (MCP)** | An agent to a tool. The tool offers tools (functions), resources (data) and prompts. | stdio (agent starts the tool as a local process) or Streamable HTTP (agent posts to one HTTP endpoint). JSON-RPC 2.0 messages. | Current revision 2026-07-28. | [M1] [M10] |
| **MCP extensions** | Optional additions, used only when both sides declare them: Tasks (long-running work), Events (wake an agent when something happens), MCP Apps (interactive UI shown in the conversation), Skills over MCP. | Same as MCP. | Events: its proposal is final and the extension is in beta. Tasks left the core protocol and became an extension in 2026-07-28. | [M1] [M5] [M8] |
| **Agent2Agent (A2A)** | One agent to another agent, not an agent to a tool. Its own documents describe it as complementary to MCP. | JSON-RPC, gRPC or HTTP+JSON. An agent is found through an "Agent Card" at a well-known web address. | Version 1.0. A project of the Agentic AI Foundation (Linux Foundation) since 27 August 2026. | [G6] [G7] [G8] [G12] [G14] |
| **Agent Client Protocol (ACP)** | A client application (first of all a code editor) to a coding agent that the application starts and drives. | JSON-RPC over stdio. A remote transport is still being specified. | Version 1 is current; version 2 went to preview on 20 November 2026. Governed jointly by Zed and JetBrains. | [P1] [P2] [P3] [P9] |
| **AGENTS.md** | A plain Markdown file of instructions that an agent reads from the folder it works in. No fields are required. The nearest file in the folder tree wins. | A file on disk. | Stewarded by the Agentic AI Foundation. | [P10] |
| **Agent Skills** | A folder with a `SKILL.md` file (name, description, instructions) plus optional scripts and reference files. The agent loads the full instructions only when a task calls for them. | Files on disk. | Open format, first developed by Anthropic. | [P11] |
| **WebMCP** | A web page to an agent that runs inside the browser. The page registers tools the agent can call. | A JavaScript API in the page (`document.modelContext`). No stdio or HTTP transport, tools only. | Draft community-group report dated 24 November 2026, not on the W3C standards track. Origin trials in Chrome 149 and Edge 150. | [W9] [W10] [W11] |
| **OpenAPI descriptions** | An agent to an HTTP API described by an OpenAPI schema. | HTTPS. | ChatGPT's custom-GPT "Actions" still use it, but OpenAI says it plans to retire custom GPTs in favour of plug-ins. Open WebUI calls OpenAPI its preferred route for most deployments. | [O10] [L7] |

Notes on the table:

- **A2A adoption:** Gemini CLI can call remote agents by Agent Card, and Gemini Enterprise can register A2A agents. [G9] [G15] A2A support in Claude, ChatGPT, Codex, Cursor and Copilot was not checked.
- **ACP adoption:** the ACP site lists about fifty agents, among them Gemini CLI, Claude (through an adapter), Codex CLI (through an adapter), GitHub Copilot (public preview), Cursor, Goose and OpenCode. Its client list includes Zed, JetBrains IDEs, Visual Studio Code, Neovim, Emacs and Obsidian. [P4] [P5]
- **What ACP gives the client application:** in version 1 the client can pass MCP server details to the agent when a session starts, the agent can ask the client to read and write text files, and the agent asks the client for permission before acting. [P6] [P7] [P12] The version 2 migration page says version 2 removes the client-provided file and terminal methods. [P8]

### What changed in MCP revision 2026-07-28

These changes matter to anyone who builds a tool for several agents. All are from the specification's change list. [M5]

- **Stateless.** The opening handshake and protocol-level sessions are gone. Every request carries its protocol version and the client's capabilities.
- **The server no longer sends its own requests.** When a tool needs input from the user, it returns an "input required" result and the agent retries with the answer.
- **Change notifications** now arrive only on a stream the agent opens with `subscriptions/listen`.
- **Deprecated:** Sampling (the tool asking the agent's model to generate text), Roots, Logging, the older HTTP+SSE transport, and Dynamic Client Registration as a way to register an OAuth client.
- **Mixed versions in the field.** Vendor documents still describe older behaviour in places: several clients still accept SSE, and several still use Dynamic Client Registration. [A2] [O2] [G2] [C1] The specification describes how a client and a server detect each other's era and fall back. [M2] [M3]

## 3. Which agents support what

"Local" means the agent starts a program on the user's machine (stdio). "Remote" means the agent calls a URL. The third column says where a remote call is made from, because that decides whether a tool on the user's own machine can be reached.

| Agent and surface | Local connection | Remote connection | Remote call is made from | Authentication for remote | Sources |
|---|---|---|---|---|---|
| **Claude: web and mobile apps** | No. The mobile app uses remote connectors only. | Yes: "custom connectors". Streamable HTTP; the older HTTP+SSE is being deprecated. | Anthropic's cloud. The server must be reachable on the public internet on port 443. A server on the user's machine needs a public URL. | OAuth with Client ID Metadata Documents or Dynamic Client Registration, a user-supplied OAuth client, or none. Static keys are in beta for a limited set of organisations. The client-credentials grant is not supported. | [A1] [A2] [A3] [A5] [A6] [A16] |
| **Claude Desktop** | Yes. Desktop extensions (`.mcpb` files) run on the user's machine over stdio and need no OAuth. A separate config file (`claude_desktop_config.json`) also defines local servers. macOS and Windows; Linux in beta. | Yes: the same custom connectors as the web app. | Anthropic's cloud for custom connectors. Local servers use the user's machine and are not available in the web app. | As the row above for connectors. None needed for local extensions. | [A1] [A4] [A15] |
| **Claude Code** | Yes: stdio. | Yes: HTTP (recommended); SSE is deprecated. Connectors from the user's Claude account also load automatically. | The user's machine for servers it is given directly (inferred). Anthropic's cloud for account connectors. | OAuth 2.0 with Client ID Metadata Documents, Dynamic Client Registration or a pre-registered client; static headers. | [A8] |
| **ChatGPT: web** | No ("not directly"). | Yes: a custom MCP server added as a plug-in. Streamable HTTP; one page also lists SSE. Custom MCP is web only, not mobile. | OpenAI's servers (inferred: OpenAI publishes outgoing IP ranges to allow-list). A private or developer-machine server needs OpenAI's Secure MCP Tunnel. | OAuth (Client ID Metadata Documents preferred, Dynamic Client Registration still supported, static OAuth credentials) or none. API keys are not supported. | [O1] [O2] [O3] [O4] [O12] |
| **ChatGPT desktop app, Codex CLI, Codex IDE extension** | Yes: stdio. The three share one configuration file (`~/.codex/config.toml`). | Yes: Streamable HTTP. SSE is not mentioned. | The user's machine (inferred). | OAuth (`codex mcp login`; Client ID Metadata Documents first, otherwise Dynamic Client Registration), a bearer token from an environment variable, or headers. | [O5] |
| **Codex in the cloud** | The Codex page warns that local servers and transports may not be available in the cloud. | Through plug-ins, as ChatGPT web (inferred). | OpenAI's servers (inferred). | As ChatGPT web (inferred). | [O5] |
| **Gemini app: web and mobile** | Not found. A custom app is added by URL only. | Yes: a "custom app" added by its MCP server URL. Added on the web app only, then usable on web and mobile. Transport not stated. | Not stated. | Dynamic Client Registration, or credentials typed in by the user. | [G1] |
| **Gemini CLI** | Yes: stdio. | Yes: SSE and Streamable HTTP. | The user's machine (inferred). | OAuth 2.0 with dynamic discovery and registration, or Google credentials. | [G2] |
| **Cursor: desktop editor and CLI** | Yes: stdio. | Yes: SSE and Streamable HTTP. | The user's machine (inferred). | OAuth. | [C1] [C3] |
| **Cursor cloud agents (web, mobile)** | stdio servers run inside the cloud agent's own virtual machine, not on the user's computer. | Yes: HTTP. Cursor says cloud agents cannot connect to a server that runs only on a member's computer. | Cursor's cloud (inferred). | OAuth. | [C1] [C2] |
| **GitHub Copilot in VS Code** | Yes: stdio. | Yes: Streamable HTTP, and legacy SSE. | The user's machine (inferred). | OAuth. | [H3] [H4] |
| **GitHub Copilot CLI and other IDEs** | Yes. JetBrains IDEs, Visual Studio and Xcode each support local servers. | Yes. | The user's machine (inferred). | The CLI has an OAuth flow. OAuth is documented for Visual Studio; for JetBrains and Xcode only a token header was found. | [H1] [H9] [H10] |
| **GitHub Copilot cloud agent** | Yes, but the server runs in the agent's cloud environment, not on the user's machine (inferred). | Yes: HTTP or SSE. MCP tools only. | GitHub's cloud (inferred). | Remote servers that use OAuth are not supported. | [H1] [H2] |
| **GitHub Copilot Chat on github.com** | No custom servers found; it has preconfigured tools. | Not found. | n/a | n/a | [H1] |
| **Local-model agents: LM Studio** | Yes. | Yes. | The user's machine (inferred). | OAuth, a configured client ID and secret, or static headers. | [L1] [L2] |
| **Local-model agents: Jan** | Yes: stdio. | Yes: Streamable HTTP and SSE. | The user's machine (inferred). | OAuth is handled for servers that need it. | [L11] |
| **Local-model agents: Goose** | Yes: stdio. | Yes: Streamable HTTP. | The user's machine (inferred). | OAuth. | [L8] |
| **Local-model agents: OpenCode** | Yes: stdio. | Yes: Streamable HTTP. | The user's machine (inferred). | OAuth, on by default for remote servers. | [L13] |
| **Local-model agents: Open WebUI** | Not directly. A separate proxy (mcpo) turns a stdio server into an HTTP one. | Yes: Streamable HTTP only. Only an administrator can add a server. | The Open WebUI server, which may be the user's own machine (inferred). | None, bearer token or OAuth 2.1. | [L7] |
| **Ollama itself** | No MCP client is documented. Ollama offers tool calling at the model level; another program has to run the tools (inferred from its examples). | No. | n/a | n/a | [L4] |

Note on the two ChatGPT rows: OpenAI's help article describes custom MCP in ChatGPT as remote and web only [O1], while the Codex page says the ChatGPT desktop app supports stdio servers through the configuration it shares with Codex [O5]. The table lists them as two surfaces. How the two fit together inside the desktop app is inferred.

### Limits on who may use custom tools

| Agent | Limit | Source |
|---|---|---|
| Claude | Custom connectors are on every plan. The Free plan allows one. On Team and Enterprise plans an Owner adds them. | [A5] |
| ChatGPT | Full MCP, including write actions, is for Business, Enterprise and Edu. Pro can connect custom servers with read and fetch only. Free, Go and Plus: not found. | [O1] |
| Gemini app | Custom apps need a personal Google account, age 18 or over, a US location and English. They are not available for work or school accounts. | [G1] |
| Gemini CLI | Replaced by Antigravity CLI on 18 June 2026 for unpaid-tier and Google One users. It stays usable with paid API keys. Antigravity CLI's MCP support was not checked. | [G4] |
| GitHub Copilot | For Business and Enterprise accounts, the "MCP servers in Copilot" policy is off by default. | [H1] |
| Open WebUI | Only administrators can add MCP servers. | [L7] |

### Instruction files

| Agent | Reads `AGENTS.md`? | Source |
|---|---|---|
| Codex | Yes, by default. Files are joined from the project root down; the default size limit is 32 KiB. | [O6] |
| Cursor | Yes, in the project root and subfolders, as an alternative to its own rules folder. | [C4] |
| GitHub Copilot | Yes in VS Code chat, the cloud agent and the CLI. The cloud agent and CLI also read `CLAUDE.md` and `GEMINI.md`. Chat on github.com lists no agent instructions. | [H5] |
| Claude Code | Yes, but by default only when the project has no `CLAUDE.md`. A setting loads both. | [A10] |
| Gemini CLI | Not by default. It reads `GEMINI.md`; a setting adds `AGENTS.md`. | [G3] |
| Goose | Yes, by default. | [L10] |
| OpenCode | Yes. It reads `CLAUDE.md` only where there is no `AGENTS.md`. | [L15] |
| Claude and ChatGPT chat apps, Gemini app | Not applicable: these agents do not work in the user's folders (inferred). | [A1] [O1] [G1] |

## 4. Local versus remote connections

### What each kind needs from the tool's side

| | Local, stdio | Local, HTTP on the same machine | Remote |
|---|---|---|---|
| **What the tool provides** | A program on the user's machine that reads requests on standard input and writes replies on standard output. | A program on the user's machine that listens on the loopback address. | An HTTPS endpoint on the public internet that accepts POST requests. |
| **Who starts it** | The agent starts it and stops it. If it exits, the agent restarts it. | The tool (or the user) keeps it running. | The tool's operator keeps it running. |
| **Setup on the user's side** | The agent's configuration names the command to run, or the user installs a packaged extension. | The agent's configuration names the local URL. | The user pastes a URL, or picks the tool from the vendor's directory. |
| **Authentication** | The MCP authorisation rules do not apply. Credentials come from the environment. | The specification says to validate the `Origin` header, bind to 127.0.0.1 only, and authenticate every connection. | OAuth 2.1. The server must publish protected-resource metadata. The client is identified by a Client ID Metadata Document, pre-registration or (deprecated) Dynamic Client Registration. |
| **Needs a network** | No. | No. | Yes. |
| **Sources** | [M2] [M4] [A4] | [M3] | [M3] [M4] |

Further facts:

- **Runtime on the user's machine.** Local servers are often scripts that need a runtime the user must already have. Jan lists Node.js or Python as a prerequisite, and Tolaria's bundled server needs Node.js or Bun. [L11] [T6]
- **Tunnels bridge the two kinds.** Anthropic and OpenAI each document a tunnel that lets their cloud reach a private server through an outgoing connection. Anthropic's is a research preview for Enterprise plans on request. Both need a network. [A7] [O4]
- **A stdio bridge to a remote server exists.** Notion documents a stdio configuration for agents that cannot make remote HTTP connections; it forwards to Notion's hosted server. [N1]

### Which agents can use only one kind

| Only remote | Both | Neither |
|---|---|---|
| Claude on web and mobile [A6]; ChatGPT on the web [O1]; the Gemini app (by URL only) [G1]; Open WebUI without a proxy [L7] | Claude Desktop [A4] [A1]; Claude Code [A8]; ChatGPT desktop app and Codex [O5]; Gemini CLI [G2]; Cursor [C1]; GitHub Copilot in VS Code, the CLI and other IDEs [H1] [H3]; LM Studio [L1]; Jan [L11]; Goose [L8]; OpenCode [L13] | Ollama itself [L4]; Copilot Chat on github.com (preconfigured tools only) [H1] |

No agent in this note supports local connections only. The cloud agents of Cursor and GitHub Copilot run "local" servers inside their own cloud environment, so those servers cannot see files on the user's machine. [C1] [H2]

## 5. What a desktop app can offer an agent with no network

Facts about the tool's side:

- **A local stdio MCP server works with no network.** The agent starts the program and talks to it over standard streams. Anthropic's packaging page for desktop extensions says they work offline. [M2] [A4]
- **A local HTTP endpoint on the loopback address works with no network** for agents that make the call from the same machine (inferred from [M3]).
- **Plain files in a folder work with no network** for any agent that has file access. An instructions file (`AGENTS.md`) or a skill tells the agent the tool's conventions. [P10] [P11] [B3]
- **A command-line interface is another local surface.** Obsidian ships one; it needs the desktop app to be running. [B2]
- **The app can start and drive the agent itself.** ACP standardises this over stdio, and Tolaria does it by running command-line agents inside the app. [P1] [T7]

Facts about the agent's side:

- **The agent also needs a model.** Without a network, that means a model on the same machine.
- **Agents documented as working with local models:** LM Studio (states that it can operate entirely offline), Jan, Goose (with Ollama, LM Studio and others), OpenCode (with Ollama and LM Studio), and Codex CLI with its `--oss` option (its page does not mention offline use). [L3] [L12] [L9] [L14] [O7]
- **GitHub Copilot in VS Code** documents fully offline use with a local "bring your own key" model, in a mode that VS Code says will be removed in February 2027. [H6] [H3]
- **Agents that need their vendor's cloud for the model:** Anthropic does not support routing Claude Code to non-Claude models. Cursor routes all requests through its own servers. Gemini CLI documents a local model only for routing decisions. [A11] [C5] [G5]
- **Local models are weaker at tool use.** The projects' own pages warn that a model must support tool calling, that default context windows are too small for agent work (Ollama suggests at least 64,000 tokens), and that many tools can overflow a local model's context. [L9] [L6] [L1] [L12]

## 6. What a browser-only web app can and cannot offer

This assumes a web app with no native helper, with documents kept in the browser's own storage.

| | Fact | Sources |
|---|---|---|
| **Cannot** | Be started as a local program by an agent (inferred: stdio needs a process the agent launches). | [M2] |
| **Cannot** | Accept incoming connections. Server sockets exist only in the Direct Sockets API, which is limited to Isolated Web Apps in Chromium. | [W1] |
| **Cannot** | Show its stored documents to other programs. The origin private file system is private to the site and not visible to the user as files; IndexedDB is same-origin only. | [W5] |
| **Cannot** | Keep a background process alive to serve an agent. A service worker is stopped when idle and wakes only for browser events. With no tab open and no network, nothing outside can reach it (inferred). | [W14] |
| **Cannot** | Guarantee the stored documents stay. Browser storage is best-effort by default and may be evicted; With tracking prevention on, Safari deletes script-written data after seven days of browser use in which the user has not interacted with the site. | [W6] |
| **Can** | Read and write real files in a folder the user picks, through the File System Access API. An agent with file access can then work on the same files. Supported in Chrome and Edge; Firefox and Safari do not have the pickers. | [W7] [W17] |
| **Can** | Be told when those files change outside the page, through `FileSystemObserver`. Experimental and non-standard; Chrome and Edge 133 and later only. | [W8] |
| **Can** | Register tools for an agent that runs inside the browser, through WebMCP. In origin trial (Chrome 149, Edge 150). The agent must visit the page to learn its tools, and the design is for a person in the loop with the page open. A standard MCP client cannot connect to it (inferred: it has no stdio or HTTP transport). | [W10] [W11] [W9] |
| **Can** | Be operated by a browser agent with no special support. Claude in Chrome reads the page, clicks, types and fills forms on sites the user permits. Gemini in Chrome has an experimental "auto browse" for US subscribers. | [A18] [G10] |
| **Can** | Call a model server on the same machine. A public HTTPS page may call `http://localhost`; since Chrome 142 the user must grant a local-network permission first. Ollama listens on 127.0.0.1:11434 and must be configured to accept the page's origin. | [W2] [W4] [W3] [L5] |
| **Can** | Run a model inside the browser. Chrome's Prompt API is open to web pages from Chrome 148 on desktop, works offline after the model download and needs 22 GB of free disk space. Tool use in Chrome's implementation was not found. WebGPU libraries such as WebLLM also run offline from cached model files. | [W12] [W13] |
| **Can, online only** | Be reached through a hosted connector, for documents that a server holds. A document that exists only in one browser's storage is not reachable by a hosted connector unless the open page passes it on (inferred; no primary source describes such a relay). | [M3] [W5] |

## 7. How comparable tools expose documents to agents

| Tool | Where documents live | Routes offered to agents | Needs a network? | Needs the app running? | Sources |
|---|---|---|---|---|---|
| **Notion** | Notion's cloud. | A hosted MCP server (Streamable HTTP; the older SSE endpoint retires on 23 February 2027). The older open-source local server is no longer maintained and also calls Notion's cloud. A REST API with webhooks. | Yes. | No. | [N1] [N6] [N13] |
| **Obsidian** | Plain Markdown files in a local folder (the "vault"). | Files on disk; Obsidian reloads when another program changes them. Official "Connectors": skills that teach an agent the file formats and the CLI. An official CLI. No official MCP server was found. A community plug-in adds a local HTTPS API with an MCP endpoint, desktop only. | No. | Not for file edits. Yes for the CLI. | [B1] [B2] [B3] [B4] [B5] |
| **Anytype** (local-first) | An encrypted local store, not plain files. Markdown is an export format. | A local API served by the desktop app on `localhost:31009`, authorised by a 4-digit code shown in the app. An official MCP server run as a local program that calls that API. A headless CLI that serves the same API without the desktop app. | No for the API. | Yes, or the headless CLI. | [Y1] [Y2] [Y3] [Y4] [Y5] [Y7] |
| **Tolaria** (local-first) | Plain Markdown files; the file system is the source of truth. | Files on disk plus an `AGENTS.md` at the vault root. A bundled MCP server over stdio, registered with each agent only when the user asks. Command-line agents run inside the app, each signing in on its own with no API key held by Tolaria. | No (inferred). | Not for the server's file tools (inferred); yes for tools that act on the app's window. | [T1] [T2] [T3] [T6] [T7] [T8] [T9] [T10] |
| **Claude Docs** | Anthropic's cloud, in the user's Claude account. | A hosted connector. In Claude Code it appears as a Claude-account connector named `claude.ai Claude Docs`. No page was found that describes a non-Claude agent connecting to it. | Yes. | No. | [A12] [A13] |

Details worth knowing:

- **Notion's MCP tools** cover search, fetch, create, update, move, duplicate, comments, suggested edits and version history. Pages are read and written as Markdown. [N2] [N3] [N4]
- **Notion's sign-in** is OAuth as the user. A workspace owner on a Business or Enterprise plan can also create a token for agents that run with no browser. [N1]
- **Obsidian's download page lists no browser version,** and its CLI and local-server plug-ins are desktop only. [B6] [B7] [B5]
- **Obsidian warns** that its metadata cache can fall out of step with the files. [B1]
- **Anytype says** not to sync its store with network drives or third-party services, because that is likely to corrupt data. A file-only agent cannot read the store. [Y6] [Y4]
- **Tolaria's MCP tools** include search, read, create, update and append, plus tools that open a note or highlight text in the running app. There is no delete tool. [T4]
- **Claude Docs in a connected session:** observed in one Claude Code session on the date above, not taken from public documentation. The connector's tools cover reading, querying, creating, updating, batching several changes, deleting and exporting. An update call can carry a document version; that this works as a guard against stale edits is inferred.

## 8. Agent-side features that matter for a document tool

### Partial reads

| Fact | Sources |
|---|---|
| MCP's `resources/read` takes a URI and returns the contents. The specification page shows no range or offset parameter; paging applies to lists. | [M6] |
| So reading part of a document is a matter of how the tool designs its own MCP tools (inferred). | [M1] |
| Agents cap what a tool may return. Claude's apps allow about 150,000 characters per tool result and 240 seconds per call. Claude Code warns above 10,000 tokens and has a default maximum of 25,000. | [A2] [A8] |
| Notion's fetch tool has no offset. A large page comes back marked as truncated with the IDs of the parts left out, and the agent fetches those by ID. | [N2] |
| Local models have small context windows, which makes whole-document reads costly. | [L6] [L1] |

### Guarded edits

| Fact | Sources |
|---|---|
| MCP has no built-in edit operation or version check. A guard is part of the tool's own design (inferred). | [M1] |
| Notion's update tool replaces text by search-and-replace. Each search string must match exactly one place. Operations that do not match are skipped and reported while the rest still apply. No version check was found. | [N3] |
| Notion offers suggested edits through MCP. The target text must appear exactly once, the page does not change until a person accepts, and there are error codes for no match, several matches, conflict and stale. Business or Enterprise plan only. | [N4] [N5] |
| Google Docs' API accepts a required revision ID and rejects the write if the document has moved on. It can also write changes as suggestions. | [D1] [D2] |
| Tolaria's update and append tools accept the file's expected modification time as a guard. | [T5] |
| Agents add their own check before a write. ChatGPT treats any tool not marked read-only as a write that needs confirmation. Gemini requires manual confirmation for write actions. | [O2] [G1] |

### Live progress

| Fact | Sources |
|---|---|
| MCP lets a tool send progress notifications (a number, an optional total and a message) for a request, if the agent asked for them. They travel only on that request's reply stream. | [M7] [M3] |
| The Tasks extension covers long-running work that the agent polls. Claude Code's page says tasks work in the cloud with Claude-account connectors that support them. | [M1] [A8] |
| Whether each agent shows progress notifications to the user: not found for Claude's apps; not checked for the others. | [A2] |
| MCP Apps lets a tool show its own interface inside the conversation. ChatGPT implements it, Claude's apps support it, Cursor lists it as supported, and VS Code marks it experimental. | [O8] [A14] [C1] [H4] |
| Outside MCP, Linear's agent platform has agents post activities (thought, action, response, error) and requires the first within 10 seconds. | [K2] |
| Tolaria's server has tools that open a note and highlight text in the running app, so a person can watch. | [T4] |

### Being summoned by a comment

| Fact | Sources |
|---|---|
| Core MCP is request-driven: the agent asks, the tool answers. A tool cannot start an agent turn through the core protocol. | [M8] |
| The MCP Events extension lets an agent subscribe to events and be woken when one happens, by polling, an open stream or a webhook. It is in beta and needs revision 2026-07-28. | [M8] |
| ChatGPT supports Events by webhook only: the event arrives in the subscribed chat and ChatGPT follows the user's standing instruction. | [O9] [M9] |
| Claude Code has "channels": an MCP server that pushes events into a running session. Research preview. The server runs as a local stdio process, events arrive only while the session is open, and it needs a Claude account sign-in. | [A9] [A19] |
| Claude Docs: a person mentions @Claude in a comment; Claude replies in the thread and makes the change. | [A12] |
| Notion: its own Custom Agents can be @-mentioned and can be triggered when a comment is added. Claude and Cursor are the first two "External Agents" that can be @-mentioned. The API for bringing another agent is in private beta. | [N7] [N8] [N11] |
| Notion: a third-party program can receive a webhook when a comment is created. The message carries IDs, not the comment's text. | [N9] |
| Linear: a session is created when an agent is mentioned or given an issue; the agent's server gets a webhook and must answer within 5 seconds. | [K1] [K2] |
| GitHub: Copilot's cloud agent starts when an issue is assigned to it or when someone with write access mentions `@copilot` in a pull-request comment. | [H7] |

In every case outside MCP Events, the summons runs through an integration built for that one agent or through the tool's own webhooks.

### Identity of the agent in the document

| Fact | Sources |
|---|---|
| MCP: a client should name itself on each request (`clientInfo`). This is the client's own statement. | [M5] |
| MCP over OAuth: the agent acts for the user who signed in. The client application can be identified by a Client ID Metadata Document, which is a web address the client controls. | [M4] |
| Notion MCP: the agent acts with the user's full permissions. Version history records changes from Notion AI, Custom Agents and MCP clients. The author name shown on an MCP edit was not found. | [N12] [N4] |
| Notion REST API: an integration is a separate bot with its own name and icon. | [N10] |
| Linear: an agent is installed as an app user, can be mentioned and assigned, and does not count as a paid seat. | [K1] |
| GitHub: the cloud agent's commits are authored by Copilot with the requester as co-author, and its pull request is opened under its own app identity. | [H8] |
| Claude Docs: every change is attributed to the person or to Claude. Claude acts only with the permissions of the person who asked. | [A12] |

## 9. What is possible where

Each cell says whether the route can work at all, given the facts above. "Local-model agent" means an agent from the local-model rows of section 3.

| Route | Desktop app, offline | Desktop app, online | Web app, offline | Web app, online |
|---|---|---|---|---|
| **Agent edits plain files, guided by an instructions file or skill** | Yes, with a local-model agent that has file access. [L9] [P10] | Yes, with any agent that has file access. [P10] [B3] | Only if the documents are real files opened through the File System Access API (Chrome and Edge), with a local-model agent. Not for documents in browser storage. [W7] [W5] | Same limit as offline, with any file-access agent. [W7] |
| **Agent starts the tool's local MCP server (stdio)** | Yes, with a local-model agent that is an MCP client. [M2] [L1] [L8] | Yes: Claude Desktop, Claude Code, Codex and the ChatGPT desktop app, Gemini CLI, Cursor, Copilot. Not Claude web or mobile, ChatGPT web or the Gemini app. [A4] [O5] [G2] [C1] [H3] | No (inferred). [M2] | No (inferred). [M2] |
| **Agent calls the tool's MCP endpoint on the same machine** | Yes, for agents that call from the user's machine (inferred). [M3] | Yes for the same agents. Cloud agents need a tunnel or a public address. [A1] [O4] | No: a page cannot listen. [W1] | No: a page cannot listen. [W1] |
| **Agent calls a hosted connector (remote MCP)** | No: it needs a network. [M3] | Yes, for every agent in section 3 that supports remote, within each vendor's plan and region limits. The hosted endpoint must be able to reach the documents. [A1] [O1] [G1] | No: it needs a network. [M3] | Yes for documents a server holds. Not for documents that exist only in the browser's storage (inferred). [W5] |
| **The app starts and drives an agent itself (ACP, or running a command-line agent)** | Yes, with a local-model agent. [P1] [L9] | Yes. [P4] [T7] | No: a page cannot start programs (inferred). [W1] | No (inferred). [W1] |
| **The app calls a model directly** | Yes, with a model server on the same machine (inferred). [L5] | Yes: any app with network access can call a hosted model (inferred). | Partly: a model server on the same machine, after a browser permission prompt in Chrome, or a model inside the browser. [W4] [W12] [W13] | Yes: a page can call a hosted model over HTTPS (inferred). |
| **An agent inside the browser acts on the open page** | Not applicable. | Not applicable. | Not established: the browser agents documented need their vendor's cloud (inferred). [A18] | Yes: by operating the page, or through WebMCP tools in Chrome and Edge trials. The page must be open. [A18] [W10] |
| **A comment summons an agent** | Only an agent already running on the machine, through a push over stdio (MCP Events, or Claude Code channels, which need a Claude sign-in). [M8] [A9] | Yes through MCP Events (beta; ChatGPT by webhook only) or a vendor-specific integration. [M8] [O9] [N8] | No route found. | Through a hosted endpoint, as for the desktop app online (inferred). [M8] |

## 10. Facts that constrain product promises

1. **"Any agent" and "offline" do not overlap for the main cloud agents.** Claude Code and Cursor are documented as tied to their vendor's models or servers, Gemini CLI documents a local model only for routing, and the Claude, ChatGPT and Gemini chat apps are cloud services (inferred). Offline agent use is limited to agents that run a local model. [A11] [C5] [G5] [L3]
2. **No single connection kind reaches every agent.** Claude on web and mobile, ChatGPT on the web and the Gemini app accept only a remote server at a public address. A local program reaches only desktop, editor and command-line agents. [A1] [O1] [G1]
3. **A remote server cannot see documents that exist only on a device.** For a cloud agent to work on a local document, the document's content has to be reachable from the internet, through a hosted copy or a tunnel (inferred from [A1] [O4]).
4. **Vendors gate custom tools by plan, region and account type.** ChatGPT allows write actions only on Business, Enterprise and Edu. Gemini custom apps are for US personal accounts in English. Claude's Free plan allows one custom connector. Copilot's policy for organisations is off by default. [O1] [G1] [A5] [H1]
5. **Mobile is remote-only where it works at all.** Claude's mobile app uses remote connectors. Gemini custom apps are added on the web and then work on mobile. ChatGPT custom MCP is web only. [A6] [G1] [O1]
6. **A browser-only web app cannot serve local agents.** It cannot be launched, cannot listen, and its storage is invisible to other programs. [W1] [W5]
7. **The web routes that exist are narrow.** File System Access is Chrome and Edge only. WebMCP is in trial and needs the page open. Browser agents operate the page as a person would. [W7] [W17] [W10] [A18]
8. **Browser storage can be evicted.** Documents kept only there are not durable by default. [W6]
9. **MCP does not define document operations.** Partial reads, guarded edits, suggestions and comments are whatever tools the document tool chooses to offer; agents treat them as ordinary tool calls (inferred from [M1] [M6]).
10. **Agents cap tool results.** A long document may exceed an agent's limit in one call (for example 25,000 tokens by default in Claude Code). [A8] [A2]
11. **A tool cannot make an agent act through core MCP.** Summoning needs the Events extension (beta, uneven support), a vendor-specific integration, or an agent session that is already open. [M8] [M9] [A9]
12. **Through a remote connector the agent acts as the signed-in user.** A separate, named identity for the agent exists in some tools' own platforms (Linear app users, Notion bots, GitHub's app identity) but is not something MCP provides beyond a self-declared client name. [M4] [M5] [K1] [N10] [H8]
13. **MCP changed shape in July 2026.** Sessions, the handshake and server-sent requests were removed, and Sampling was deprecated, so a tool cannot rely on borrowing the agent's model. Agents in the field speak different revisions. [M5]
14. **Authentication is moving.** The current specification prefers Client ID Metadata Documents and deprecates Dynamic Client Registration, while Gemini's custom apps and several other clients still rely on Dynamic Client Registration. [M4] [G1] [G2]
15. **`AGENTS.md` is widely read but not universal by default.** Claude Code reads it only when there is no `CLAUDE.md`, and Gemini CLI needs a setting. Chat apps do not read folder files at all. [A10] [G3]
16. **Local models need capable hardware and settings.** Tool calling and a large context window are prerequisites, by the projects' own account. [L9] [L6] [L12]
17. **A local server often needs a runtime on the user's machine.** [L11] [T6]
18. **Claude Docs, the reference product, is cloud-hosted and reaches agents through a Claude-account connector.** No public page describes another vendor's agent connecting to it. [A12] [A13]

## 11. Gaps and open questions

- **Antigravity CLI.** It replaced Gemini CLI for many users in June 2026. Its MCP and instruction-file support was not checked. [G4]
- **Which MCP revision each agent speaks.** Vendor pages rarely say. The official extension support matrix was opened, but its per-client marks did not come through as text, apart from "partial" for ChatGPT on Skills and Events. [M9]
- **Where the Gemini app makes its MCP calls from,** and which transport it uses. Not stated. [G1]
- **Whether browser agents use WebMCP tools yet.** Chrome's page names extensions as callers and treats Gemini in Chrome separately. Support in Claude in Chrome was not found. [W10]
- **A relay from an open browser tab to a hosted endpoint.** No primary source describes one. Whether it is workable is untested.
- **Progress display.** Whether each agent shows MCP progress notifications to the user was not established.
- **A2A support** in Claude, ChatGPT, Codex, Cursor and Copilot was not checked.
- **Claude Docs connector details** (tool list, limits) are not in public documentation. Ticket #37 holds the feature inventory.

## Sources

All opened on 26 November 2026.

**Model Context Protocol**

- [M1] https://modelcontextprotocol.io/specification/latest (served revision 2026-07-28)
- [M2] https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio
- [M3] https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
- [M4] https://modelcontextprotocol.io/specification/latest/basic/authorization
- [M5] https://modelcontextprotocol.io/specification/2026-07-28/changelog.md
- [M6] https://modelcontextprotocol.io/specification/2026-07-28/server/resources.md
- [M7] https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/progress.md
- [M8] https://modelcontextprotocol.io/extensions/events/overview.md
- [M9] https://modelcontextprotocol.io/extensions/client-matrix.md
- [M10] https://modelcontextprotocol.io/specification/latest/basic/transports

**Anthropic (Claude)**

- [A1] https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp
- [A2] https://claude.com/docs/connectors/building
- [A3] https://claude.com/docs/connectors/building/authentication.md
- [A4] https://claude.com/docs/connectors/building/mcpb.md
- [A5] https://claude.com/docs/connectors/custom/add-unlisted.md
- [A6] https://claude.com/docs/connectors/getting-started.md
- [A7] https://claude.com/docs/connectors/mcp-tunnels/overview.md
- [A8] https://code.claude.com/docs/en/mcp
- [A9] https://code.claude.com/docs/en/channels.md
- [A10] https://code.claude.com/docs/en/memory.md
- [A11] https://code.claude.com/docs/en/llm-gateway.md
- [A12] https://support.claude.com/en/articles/16923645-get-started-with-claude-docs
- [A13] https://code.claude.com/docs/en/artifacts
- [A14] https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude
- [A15] https://code.claude.com/docs/en/desktop-linux.md
- [A16] https://claude.com/docs/connectors/building/testing.md
- [A18] https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome
- [A19] https://code.claude.com/docs/en/channels-reference.md

**OpenAI (ChatGPT, Codex)**

- [O1] https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt
- [O2] https://developers.openai.com/api/docs/guides/developer-mode
- [O3] https://developers.openai.com/plugins/build/auth
- [O4] https://developers.openai.com/api/docs/guides/secure-mcp-tunnels
- [O5] https://learn.chatgpt.com/docs/extend/mcp.md
- [O6] https://learn.chatgpt.com/docs/agent-configuration/agents-md
- [O7] https://learn.chatgpt.com/docs/config-file/config-advanced
- [O8] https://developers.openai.com/plugins/build/chatgpt-ui
- [O9] https://developers.openai.com/plugins/build/mcp-events
- [O10] https://help.openai.com/en/articles/9442513-configuring-actions-in-gpts
- [O12] https://developers.openai.com/api/docs/guides/ip-addresses

**Google (Gemini, A2A)**

- [G1] https://support.google.com/gemini/answer/17209137?hl=en&co=GENIE.Platform%3DDesktop
- [G2] https://geminicli.com/docs/tools/mcp-server/
- [G3] https://geminicli.com/docs/cli/gemini-md/
- [G4] https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli
- [G5] https://geminicli.com/docs/core/local-model-routing/
- [G6] https://a2a-protocol.org/latest/
- [G7] https://a2a-protocol.org/latest/topics/a2a-and-mcp/
- [G8] https://a2a-protocol.org/latest/blog/2026/08/27/a-new-chapter-for-a2a-joining-the-agentic-ai-foundation/
- [G9] https://geminicli.com/docs/core/remote-agents/
- [G10] https://support.google.com/chrome/answer/16821166?hl=en
- [G12] https://a2a-protocol.org/latest/topics/agent-discovery/
- [G14] https://a2a-protocol.org/latest/specification/
- [G15] https://docs.cloud.google.com/gemini/enterprise/docs/register-and-manage-an-a2a-agent

**Cursor**

- [C1] https://cursor.com/docs/context/mcp
- [C2] https://cursor.com/docs/cloud-agent/capabilities
- [C3] https://cursor.com/docs/cli/mcp
- [C4] https://cursor.com/docs/context/rules
- [C5] https://cursor.com/docs/settings/api-keys

**GitHub Copilot and VS Code**

- [H1] https://docs.github.com/en/copilot/concepts/context/mcp
- [H2] https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers
- [H3] https://code.visualstudio.com/docs/agents/reference/mcp-configuration
- [H4] https://code.visualstudio.com/api/extension-guides/ai/mcp
- [H5] https://docs.github.com/en/copilot/reference/custom-instructions-support
- [H6] https://code.visualstudio.com/docs/agent-customization/language-models
- [H7] https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github
- [H8] https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations
- [H9] https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference
- [H10] https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp

**Local-model agents**

- [L1] https://lmstudio.ai/docs/app/mcp
- [L2] https://lmstudio.ai/docs/integrations/mcp-remote
- [L3] https://lmstudio.ai/docs/app/offline
- [L4] https://docs.ollama.com/capabilities/tool-calling
- [L5] https://docs.ollama.com/faq
- [L6] https://docs.ollama.com/context-length
- [L7] https://docs.openwebui.com/features/extensibility/mcp
- [L8] https://goose-docs.ai/docs/getting-started/using-extensions
- [L9] https://goose-docs.ai/docs/getting-started/providers
- [L10] https://goose-docs.ai/docs/guides/context-engineering/using-goosehints
- [L11] https://docs.jan.ai/desktop/integrations/mcp-servers
- [L12] https://docs.jan.ai/desktop/mcp
- [L13] https://opencode.ai/docs/mcp-servers/
- [L14] https://opencode.ai/docs/providers/
- [L15] https://opencode.ai/docs/rules/

**Other protocols and formats**

- [P1] https://agentclientprotocol.com/get-started/introduction
- [P2] https://agentclientprotocol.com/protocol/v1/transports
- [P3] https://agentclientprotocol.com/community/governance
- [P4] https://agentclientprotocol.com/get-started/agents
- [P5] https://agentclientprotocol.com/get-started/clients
- [P6] https://agentclientprotocol.com/protocol/v1/session-setup
- [P7] https://agentclientprotocol.com/protocol/v1/file-system
- [P8] https://agentclientprotocol.com/protocol/v2/migration
- [P9] https://agentclientprotocol.com/announcements/acp-v2-preview
- [P10] https://agents.md/
- [P11] https://agentskills.io/
- [P12] https://agentclientprotocol.com/protocol/v1/tool-calls

**Notion, Linear, Google Docs**

- [N1] https://developers.notion.com/guides/mcp/get-started-with-mcp.md
- [N2] https://developers.notion.com/guides/mcp/tools-search-reference.md
- [N3] https://developers.notion.com/guides/mcp/tools-pages-reference.md
- [N4] https://developers.notion.com/guides/mcp/tools-comments-reference.md
- [N5] https://developers.notion.com/guides/mcp/tools-comments.md
- [N6] https://github.com/makenotion/notion-mcp-server
- [N7] https://www.notion.com/help/custom-agents
- [N8] https://www.notion.com/releases/2026-07-01
- [N9] https://developers.notion.com/reference/webhooks-events-delivery.md
- [N10] https://developers.notion.com/guides/data-apis/working-with-comments.md
- [N11] https://www.notion.com/help/what-is-the-notion-developer-platform
- [N12] https://www.notion.com/help/notion-mcp
- [N13] https://developers.notion.com/guides/mcp/build-mcp-client.md
- [K1] https://linear.app/developers/agents
- [K2] https://linear.app/developers/agent-interaction
- [D1] https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate
- [D2] https://developers.google.com/workspace/docs/api/how-tos/suggestions

**Obsidian, Anytype, Tolaria**

- [B1] https://obsidian.md/help/data-storage
- [B2] https://obsidian.md/help/cli
- [B3] https://obsidian.md/help/connectors
- [B4] https://github.com/obsidianmd/obsidian-skills
- [B5] https://github.com/coddingtonbear/obsidian-local-rest-api (community plug-in, not official)
- [B6] https://obsidian.md/download
- [B7] https://docs.obsidian.md/Plugins/Getting+started/Mobile+development
- [Y1] https://doc.anytype.io/anytype/features/integrations/local-api
- [Y2] https://developers.anytype.io/docs/guides/get-started/authentication
- [Y3] https://github.com/anyproto/anytype-mcp
- [Y4] https://doc.anytype.io/anytype/basics/vault
- [Y5] https://github.com/anyproto/anytype-cli
- [Y6] https://doc.anytype.io/anytype/data/sync-and-backup/local-only
- [Y7] https://doc.anytype.io/anytype/data/import-and-export
- [T1] https://github.com/refactoringhq/tolaria
- [T2] https://tolaria.md/concepts/vaults
- [T3] https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0011-mcp-server-for-ai-integration.md
- [T4] https://github.com/refactoringhq/tolaria/blob/main/mcp-server/index.js
- [T5] https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0158-vault-write-mcp-tools-update-and-append.md
- [T6] https://github.com/refactoringhq/tolaria/blob/main/docs/ARCHITECTURE.md
- [T7] https://tolaria.md/guides/use-ai-panel
- [T8] https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0065-root-managed-ai-guidance-files.md
- [T9] https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0074-explicit-external-ai-tool-setup-and-least-privilege-desktop-scope.md
- [T10] https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0028-cli-agent-only-no-api-key.md

**Web platform**

- [W1] https://developer.chrome.com/docs/iwa/direct-sockets
- [W2] https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content
- [W3] https://developer.chrome.com/blog/local-network-access
- [W4] https://developer.chrome.com/release-notes/142
- [W5] https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
- [W6] https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- [W7] https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
- [W8] https://developer.mozilla.org/en-US/docs/Web/API/FileSystemObserver
- [W9] https://webmachinelearning.github.io/webmcp/
- [W10] https://developer.chrome.com/docs/ai/webmcp
- [W11] https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md
- [W12] https://developer.chrome.com/docs/ai/prompt-api
- [W13] https://web.dev/articles/ai-chatbot-webllm
- [W14] https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope
- [W17] https://bcd.developer.mozilla.org/bcd/api/v0/current/api.Window.showDirectoryPicker.json (MDN browser-compatibility data)

[M1]: https://modelcontextprotocol.io/specification/latest
[M2]: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio
[M3]: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
[M4]: https://modelcontextprotocol.io/specification/latest/basic/authorization
[M5]: https://modelcontextprotocol.io/specification/2026-07-28/changelog.md
[M6]: https://modelcontextprotocol.io/specification/2026-07-28/server/resources.md
[M7]: https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/progress.md
[M8]: https://modelcontextprotocol.io/extensions/events/overview.md
[M9]: https://modelcontextprotocol.io/extensions/client-matrix.md
[M10]: https://modelcontextprotocol.io/specification/latest/basic/transports
[A1]: https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp
[A2]: https://claude.com/docs/connectors/building
[A3]: https://claude.com/docs/connectors/building/authentication.md
[A4]: https://claude.com/docs/connectors/building/mcpb.md
[A5]: https://claude.com/docs/connectors/custom/add-unlisted.md
[A6]: https://claude.com/docs/connectors/getting-started.md
[A7]: https://claude.com/docs/connectors/mcp-tunnels/overview.md
[A8]: https://code.claude.com/docs/en/mcp
[A9]: https://code.claude.com/docs/en/channels.md
[A10]: https://code.claude.com/docs/en/memory.md
[A11]: https://code.claude.com/docs/en/llm-gateway.md
[A12]: https://support.claude.com/en/articles/16923645-get-started-with-claude-docs
[A13]: https://code.claude.com/docs/en/artifacts
[A14]: https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude
[A15]: https://code.claude.com/docs/en/desktop-linux.md
[A16]: https://claude.com/docs/connectors/building/testing.md
[A18]: https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome
[A19]: https://code.claude.com/docs/en/channels-reference.md
[O1]: https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt
[O2]: https://developers.openai.com/api/docs/guides/developer-mode
[O3]: https://developers.openai.com/plugins/build/auth
[O4]: https://developers.openai.com/api/docs/guides/secure-mcp-tunnels
[O5]: https://learn.chatgpt.com/docs/extend/mcp.md
[O6]: https://learn.chatgpt.com/docs/agent-configuration/agents-md
[O7]: https://learn.chatgpt.com/docs/config-file/config-advanced
[O8]: https://developers.openai.com/plugins/build/chatgpt-ui
[O9]: https://developers.openai.com/plugins/build/mcp-events
[O10]: https://help.openai.com/en/articles/9442513-configuring-actions-in-gpts
[O12]: https://developers.openai.com/api/docs/guides/ip-addresses
[G1]: https://support.google.com/gemini/answer/17209137?hl=en&co=GENIE.Platform%3DDesktop
[G2]: https://geminicli.com/docs/tools/mcp-server/
[G3]: https://geminicli.com/docs/cli/gemini-md/
[G4]: https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli
[G5]: https://geminicli.com/docs/core/local-model-routing/
[G6]: https://a2a-protocol.org/latest/
[G7]: https://a2a-protocol.org/latest/topics/a2a-and-mcp/
[G8]: https://a2a-protocol.org/latest/blog/2026/08/27/a-new-chapter-for-a2a-joining-the-agentic-ai-foundation/
[G9]: https://geminicli.com/docs/core/remote-agents/
[G10]: https://support.google.com/chrome/answer/16821166?hl=en
[G12]: https://a2a-protocol.org/latest/topics/agent-discovery/
[G14]: https://a2a-protocol.org/latest/specification/
[G15]: https://docs.cloud.google.com/gemini/enterprise/docs/register-and-manage-an-a2a-agent
[C1]: https://cursor.com/docs/context/mcp
[C2]: https://cursor.com/docs/cloud-agent/capabilities
[C3]: https://cursor.com/docs/cli/mcp
[C4]: https://cursor.com/docs/context/rules
[C5]: https://cursor.com/docs/settings/api-keys
[H1]: https://docs.github.com/en/copilot/concepts/context/mcp
[H2]: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers
[H3]: https://code.visualstudio.com/docs/agents/reference/mcp-configuration
[H4]: https://code.visualstudio.com/api/extension-guides/ai/mcp
[H5]: https://docs.github.com/en/copilot/reference/custom-instructions-support
[H6]: https://code.visualstudio.com/docs/agent-customization/language-models
[H7]: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github
[H8]: https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations
[H9]: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference
[H10]: https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/extend-copilot-with-tools-and-context/extend-copilot-chat-with-mcp
[L1]: https://lmstudio.ai/docs/app/mcp
[L2]: https://lmstudio.ai/docs/integrations/mcp-remote
[L3]: https://lmstudio.ai/docs/app/offline
[L4]: https://docs.ollama.com/capabilities/tool-calling
[L5]: https://docs.ollama.com/faq
[L6]: https://docs.ollama.com/context-length
[L7]: https://docs.openwebui.com/features/extensibility/mcp
[L8]: https://goose-docs.ai/docs/getting-started/using-extensions
[L9]: https://goose-docs.ai/docs/getting-started/providers
[L10]: https://goose-docs.ai/docs/guides/context-engineering/using-goosehints
[L11]: https://docs.jan.ai/desktop/integrations/mcp-servers
[L12]: https://docs.jan.ai/desktop/mcp
[L13]: https://opencode.ai/docs/mcp-servers/
[L14]: https://opencode.ai/docs/providers/
[L15]: https://opencode.ai/docs/rules/
[P1]: https://agentclientprotocol.com/get-started/introduction
[P2]: https://agentclientprotocol.com/protocol/v1/transports
[P3]: https://agentclientprotocol.com/community/governance
[P4]: https://agentclientprotocol.com/get-started/agents
[P5]: https://agentclientprotocol.com/get-started/clients
[P6]: https://agentclientprotocol.com/protocol/v1/session-setup
[P7]: https://agentclientprotocol.com/protocol/v1/file-system
[P8]: https://agentclientprotocol.com/protocol/v2/migration
[P9]: https://agentclientprotocol.com/announcements/acp-v2-preview
[P10]: https://agents.md/
[P11]: https://agentskills.io/
[P12]: https://agentclientprotocol.com/protocol/v1/tool-calls
[N1]: https://developers.notion.com/guides/mcp/get-started-with-mcp.md
[N2]: https://developers.notion.com/guides/mcp/tools-search-reference.md
[N3]: https://developers.notion.com/guides/mcp/tools-pages-reference.md
[N4]: https://developers.notion.com/guides/mcp/tools-comments-reference.md
[N5]: https://developers.notion.com/guides/mcp/tools-comments.md
[N6]: https://github.com/makenotion/notion-mcp-server
[N7]: https://www.notion.com/help/custom-agents
[N8]: https://www.notion.com/releases/2026-07-01
[N9]: https://developers.notion.com/reference/webhooks-events-delivery.md
[N10]: https://developers.notion.com/guides/data-apis/working-with-comments.md
[N11]: https://www.notion.com/help/what-is-the-notion-developer-platform
[N12]: https://www.notion.com/help/notion-mcp
[N13]: https://developers.notion.com/guides/mcp/build-mcp-client.md
[K1]: https://linear.app/developers/agents
[K2]: https://linear.app/developers/agent-interaction
[D1]: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/batchUpdate
[D2]: https://developers.google.com/workspace/docs/api/how-tos/suggestions
[B1]: https://obsidian.md/help/data-storage
[B2]: https://obsidian.md/help/cli
[B3]: https://obsidian.md/help/connectors
[B4]: https://github.com/obsidianmd/obsidian-skills
[B5]: https://github.com/coddingtonbear/obsidian-local-rest-api
[B6]: https://obsidian.md/download
[B7]: https://docs.obsidian.md/Plugins/Getting+started/Mobile+development
[Y1]: https://doc.anytype.io/anytype/features/integrations/local-api
[Y2]: https://developers.anytype.io/docs/guides/get-started/authentication
[Y3]: https://github.com/anyproto/anytype-mcp
[Y4]: https://doc.anytype.io/anytype/basics/vault
[Y5]: https://github.com/anyproto/anytype-cli
[Y6]: https://doc.anytype.io/anytype/data/sync-and-backup/local-only
[Y7]: https://doc.anytype.io/anytype/data/import-and-export
[T1]: https://github.com/refactoringhq/tolaria
[T2]: https://tolaria.md/concepts/vaults
[T3]: https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0011-mcp-server-for-ai-integration.md
[T4]: https://github.com/refactoringhq/tolaria/blob/main/mcp-server/index.js
[T5]: https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0158-vault-write-mcp-tools-update-and-append.md
[T6]: https://github.com/refactoringhq/tolaria/blob/main/docs/ARCHITECTURE.md
[T7]: https://tolaria.md/guides/use-ai-panel
[T8]: https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0065-root-managed-ai-guidance-files.md
[T9]: https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0074-explicit-external-ai-tool-setup-and-least-privilege-desktop-scope.md
[T10]: https://github.com/refactoringhq/tolaria/blob/main/docs/adr/0028-cli-agent-only-no-api-key.md
[W1]: https://developer.chrome.com/docs/iwa/direct-sockets
[W2]: https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content
[W3]: https://developer.chrome.com/blog/local-network-access
[W4]: https://developer.chrome.com/release-notes/142
[W5]: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
[W6]: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
[W7]: https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
[W8]: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemObserver
[W9]: https://webmachinelearning.github.io/webmcp/
[W10]: https://developer.chrome.com/docs/ai/webmcp
[W11]: https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md
[W12]: https://developer.chrome.com/docs/ai/prompt-api
[W13]: https://web.dev/articles/ai-chatbot-webllm
[W14]: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope
[W17]: https://bcd.developer.mozilla.org/bcd/api/v0/current/api.Window.showDirectoryPicker.json
