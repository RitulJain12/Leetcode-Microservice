const { StateGraph, MessagesAnnotation } = require('@langchain/langgraph');
const { ChatGroq } = require('@langchain/groq');

const { AIMessage, ToolMessage, HumanMessage, } = require("@langchain/core/messages");
const tools = require("./tools");
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
    temperature: 0.5,
}).bindTools(Object.values(tools));

const graph = new StateGraph(MessagesAnnotation)

    .addNode('chat', async (state) => {
        const response = await model.invoke(state.messages);
        return {
            messages: [
                ...state.messages,
                new AIMessage({
                    content: response.content,
                    tool_calls: response.tool_calls ?? [],
                })
            ]
        }

    })
    .addNode('tools', async (state) => {

        const lastmsg = state.messages[state.messages.length - 1];
        if (!lastmsg.tool_calls || lastmsg.tool_calls.length === 0) {
            throw new Error("Tools node hit without tool_calls");
        }

        const toolMsg = await Promise.all(lastmsg.tool_calls.map(async (toolCall) => {
            const tool = tools[toolCall.name];
            if (!tool) throw new Error(`Tool not found: ${toolCall.name}`);

            const result = await tool.invoke(toolCall.args);
            return new ToolMessage({
                content: result,
                tool_call_id: toolCall.id,
            })
        }))
        return {
            messages: [
                ...state.messages,
                ...toolMsg
            ]
        }

    })


    .addEdge("__start__", "chat")
    .addConditionalEdges("chat", (state) => {
        const last = state.messages[state.messages.length - 1];
        return last.tool_calls && last.tool_calls.length > 0
            ? "tools"
            : "__end__";
    })
    .addEdge("tools", "chat");

const agent = graph.compile();


module.exports = agent;

