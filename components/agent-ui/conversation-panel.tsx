'use client';

// Adapted from shczhen/agent-ui's Agora Glass ConversationPanel; see styles/agent-ui/PROVENANCE.md.
import { useEffect, useRef } from 'react';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Message, MessageContent, MessageHeader } from '@/components/ui/message';
import { Status, type VoiceState } from '@/components/status';

interface TranscriptMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  createdAt?: number;
  streaming?: boolean;
}

export function ConversationPanel({ messages, voiceState = 'ready', hidden = false }: {
  messages: TranscriptMessage[]; voiceState?: VoiceState; hidden?: boolean;
}) {
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = log.current;
    if (node && node.scrollHeight - node.scrollTop - node.clientHeight < 180) node.scrollTop = node.scrollHeight;
  }, [messages]);
  return <section id="shopping-transcript" className="ag-conversation shopping-transcript" hidden={hidden} aria-label="Conversation with Shopping Assistant">
    <header className="ag-panel-header"><div><h2 className="ag-block-title">Shopping Assistant</h2><Status state={voiceState} /></div></header>
    <div ref={log} className="shopping-messages" role="log" aria-label="Shopping live transcript" aria-live="polite" tabIndex={0}>
      {!messages.length ? <div className="shopping-empty"><h3>Find the right fit.</h3><p>Tell the assistant your budget and what you need. Compare options, review your basket, then confirm an unpaid order.</p></div> : messages.map(message => <Message key={message.id} align={message.role === 'user' ? 'end' : 'start'}>
        <MessageContent><MessageHeader>{message.role === 'user' ? 'You' : 'Shopping Assistant'}{message.streaming && <span className="ml-2">Live</span>}</MessageHeader>
          <Bubble variant={message.role === 'user' ? 'tinted' : 'outline'} align={message.role === 'user' ? 'end' : 'start'}><BubbleContent>{message.text}</BubbleContent></Bubble>
        </MessageContent>
      </Message>)}
    </div>
  </section>;
}
