'use client';

import { Loader2, Mic, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

type QuickstartPreCallCardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  isLoading: boolean;
  error: string | null;
  onStartConversation: () => void;
};

export function QuickstartPreCallCard({
  open, onOpenChange, disabled,
  isLoading,
  error,
  onStartConversation,
}: QuickstartPreCallCardProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="shopping-dialog shopping-entry">
      <div className="shopping-entry-icon"><ShoppingBag size={26} /></div>
      <DialogHeader><span className="shopping-eyebrow">SCENARIO 09 / VOICE SHOPPING</span>
        <DialogTitle>From finding a fit to a saved order.</DialogTitle>
        <DialogDescription>Compare microphones and cameras by budget and features. Review your basket with the assistant, then confirm an unpaid order you can look up or cancel.</DialogDescription>
      </DialogHeader>
      <p className="shopping-muted">Fixed example products and simulated stock. No payment or delivery.</p>
      <DialogFooter>
      <Button variant="outline" onClick={() => onOpenChange(false)}>Browse Products</Button>
      <Button
        onClick={onStartConversation}
        disabled={isLoading || disabled}
        aria-label={
          isLoading
            ? 'Connecting to Shopping Assistant'
            : 'Start Voice Shopping'
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting…
          </>
        ) : (
          <><Mic size={16} />Start Voice Shopping</>
        )}
      </Button>
      </DialogFooter>
      {error && <p role="alert" className="shopping-error">{error}</p>}
    </DialogContent></Dialog>
  );
}
