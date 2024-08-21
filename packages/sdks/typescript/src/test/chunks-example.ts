export const CHUNKS = [
  {
    data: {
      type: 'chain-step',
      isLastStep: false,
      config: {
        provider: 'openai',
      },
      messages: [
        {
          role: 'system',
          content: "What's bigger 9.9 or 9.11?",
        },
      ],
    },
    event: 'latitude-event',
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: '9',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: '.',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: '9',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: ' is',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: ' bigger',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: ' than',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: ' ',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: '9',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: '.',
    },
  },
  {
    event: 'provider-event',
    data: {
      type: 'text-delta',
      textDelta: '11',
    },
  },
  {
    event: 'latitude-event',
    data: {
      type: 'chain-step-complete',
      response: {
        text: '9.9 is bigger than 9.11',
        usage: {
          promptTokens: 19,
          completionTokens: 84,
          totalTokens: 103,
        },
        toolCalls: [],
      },
    },
  },
  {
    data: {
      type: 'chain-step',
      isLastStep: true,
      config: {
        provider: 'openai',
      },
      messages: [
        {
          role: 'assistant',
          content: '9.9 is bigger than 9.11',
          toolCalls: [],
        },
        {
          role: 'system',
          content: 'Expand your answer',
        },
      ],
    },
    event: 'latitude-event',
  },
  {
    event: 'latitude-event',
    data: {
      type: 'chain-complete',
      config: {
        provider: 'openai',
        model: 'gpt-4o',
      },
      messages: [
        {
          role: 'assistant',
          toolCalls: [],
          content:
            "Sure, let's break it down step by step to understand why 9.9 is greater than 9.11",
        },
      ],
      response: {
        text: "Sure, let's break it down step by step to understand why 9.9 is greater than 9.11",
        toolCalls: [],
        usage: {
          promptTokens: 114,
          completionTokens: 352,
          totalTokens: 466,
        },
      },
    },
  },
]

export const FINAL_RESPONSE = {
  conversation: [
    { role: 'system', content: "What's bigger 9.9 or 9.11?" },
    {
      role: 'assistant',
      content: '9.9 is bigger than 9.11',
      toolCalls: [],
    },
    { role: 'system', content: 'Expand your answer' },
    {
      role: 'assistant',
      toolCalls: [],
      content:
        "Sure, let's break it down step by step to understand why 9.9 is greater than 9.11",
    },
  ],
  response: {
    text: "Sure, let's break it down step by step to understand why 9.9 is greater than 9.11",
    toolCalls: [],
    usage: { promptTokens: 114, completionTokens: 352, totalTokens: 466 },
  },
}