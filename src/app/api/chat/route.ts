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

import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  //   stepCountIs,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "poolside/laguna-s-2.1-free",
    messages: await convertToModelMessages(messages),
    // stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        inputSchema: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: "Convert a temperature in fahrenheit to celsius ",
        inputSchema: z.object({
          temperature: z
            .number()
            .describe("The temperature in fahrenheit to convert"),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
      timeInTimezone: tool({
        description: "Get the current time in a given city",
        inputSchema: z.object({
          timezone: z
            .string()
            .describe(
              "City name, e.g. 'New York', 'Los Angeles', 'London', 'Tokyo'",
            ),
        }),
        execute: async ({ timezone }) => {
          try {
            const time = new Intl.DateTimeFormat("en-US", {
              timeZone: timezone,
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            }).format(new Date());
            return { timezone, time };
          } catch {
            return { error: `Unknown timezone: ${timezone}` };
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
