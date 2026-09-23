// import {
//   streamText,
//   UIMessage,
//   convertToModelMessages,
//   createUIMessageStreamResponse,
//   toUIMessageStream,
// } from "ai";

// export async function POST(req: Request) {
//   const { messages }: { messages: UIMessage[] } = await req.json();

//   const result = streamText({
//     model: "poolside/laguna-s-2.1-free",
//     messages: await convertToModelMessages(messages),
//   });

//   return createUIMessageStreamResponse({
//     stream: toUIMessageStream({ stream: result.stream }),
//   });
// }

import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "poolside/laguna-s-2.1-free",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
