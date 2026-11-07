'use client';

import { ChevronDown } from 'lucide-react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const questions = [
  {
    question: 'How do I start a conversation?',
    answer: 'Choose Start voice shopping and allow microphone access when your browser asks. Speak in English and tell the assistant what you need. You can mute the microphone or end the conversation with the voice controls.',
  },
  {
    question: 'What should I say?',
    answer: 'Start with your use case and a budget. For example: “I need a USB microphone for video calls under 150 dollars.” You can ask for a comparison or change your budget during the conversation.',
  },
  {
    question: 'Which products and markets does this demo cover?',
    answer: 'This demo focuses on microphones and cameras from Shopify merchants, with U.S. delivery and prices in U.S. dollars. The assistant checks live product information before making a recommendation.',
  },
  {
    question: 'Why does the assistant sometimes pause?',
    answer: 'Live product checks can take a moment. A short acknowledgement can play while the assistant waits. Let it finish, then refine your request. If it reports a lookup problem, ask it to try again.',
  },
  {
    question: 'Can I place an order or pay here?',
    answer: 'Ask for the product and merchant names, then visit the merchant’s website to buy. This demo does not create orders or collect payment. The merchant confirms final pricing, availability and delivery.',
  },
  {
    question: 'What if my microphone does not work?',
    answer: 'Check that microphone access is allowed for this page and that the correct input device is selected in your browser or system settings. Make sure the microphone is not muted, then try Start voice shopping again.',
  },
];

export function ScenarioFaq() {
  return (
    <DialogContent className="demo-inspector demo-faq-drawer">
      <DialogHeader className="demo-faq-heading">
        <DialogTitle>Frequently asked questions</DialogTitle>
        <DialogDescription>How to get started, what to ask, and what to expect.</DialogDescription>
      </DialogHeader>
      <div className="demo-faq-list">
        {questions.map(({ question, answer }) => (
          <details className="demo-faq-item" key={question}>
            <summary>
              <span>{question}</span>
              <ChevronDown className="demo-faq-chevron" size={16} aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </DialogContent>
  );
}
