'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '@/scenarios/09-voice-shopping/catalog';
import type { ShoppingSession } from '@/scenarios/09-voice-shopping/shopping-types';

const root = '/api/scenarios/09-voice-shopping';
const storageKey = 'voice-shopping-session';

export function shoppingErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : '';
  if (code.startsWith('insufficient_stock')) return 'There is not enough stock for this basket. Reduce the quantity or choose another product, then review again.';
  if (code === 'cart_changed_review_again' || code === 'price_changed_review_again') return 'Your basket changed. Review the latest items and total before confirming again.';
  if (code === 'shopping_session_not_found') return 'This shopping session is no longer available. Reload to start a new basket.';
  return 'We could not update your shopping session. Your action has not been confirmed. Please try again.';
}

async function json<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, body === undefined ? { cache: 'no-store' } : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'shopping_operation_failed');
  return data;
}

export function useShopping(voiceActive: boolean) {
  const [session, setSession] = useState<ShoppingSession | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const operation = useRef(false);
  const initialized = useRef<Promise<ShoppingSession> | null>(null);

  const loadProducts = useCallback(async () => {
    const data = await json<{ products: Product[] }>(`${root}/products`);
    setProducts(data.products);
  }, []);

  const initialize = useCallback(() => {
    if (!initialized.current) initialized.current = (async () => {
      let id: string | null = null;
      try { id = localStorage.getItem(storageKey); } catch { /* Shopping still works without browser storage. */ }
      let next: ShoppingSession | null = null;
      if (id) {
        try { next = await json<ShoppingSession>(`${root}/sessions/${encodeURIComponent(id)}`); }
        catch (error) { if (!(error instanceof Error) || error.message !== 'shopping_session_not_found') throw error; }
      }
      next ??= await json<ShoppingSession>(`${root}/sessions`, {});
      try { localStorage.setItem(storageKey, next.session_id); } catch { /* The current tab retains the session. */ }
      return next;
    })().catch(error => { initialized.current = null; throw error; });
    return initialized.current;
  }, []);

  useEffect(() => {
    let active = true;
    initialize().then(async next => {
      if (!active) return;
      setSession(next);
      await loadProducts();
    }).catch(error => { if (active) setError(shoppingErrorMessage(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [initialize, loadProducts]);

  const refresh = useCallback(async () => {
    if (!session || operation.current) return;
    operation.current = true;
    setBusy(true);
    try {
      const next = await json<ShoppingSession>(`${root}/sessions/${session.session_id}`);
      setSession(next);
      await loadProducts();
      setError(null);
    } catch (error) { setError(shoppingErrorMessage(error)); }
    finally { operation.current = false; setBusy(false); }
  }, [session, loadProducts]);

  useEffect(() => {
    if (!voiceActive) return;
    const timer = setInterval(() => { void refresh(); }, 2500);
    return () => clearInterval(timer);
  }, [voiceActive, refresh]);

  const mutate = async (path: string, body: unknown) => {
    if (!session || operation.current) return false;
    operation.current = true;
    setBusy(true);
    setError(null);
    try {
      const next = await json<ShoppingSession>(`${root}/sessions/${session.session_id}${path}`, body);
      setSession(next);
      try { await loadProducts(); }
      catch { setError('Your basket or order was updated, but availability could not refresh. Refresh before your next change.'); }
      return true;
    } catch (error) {
      setError(shoppingErrorMessage(error));
      // Recover the authoritative basket after a stale quote or concurrent voice edit.
      try { setSession(await json<ShoppingSession>(`${root}/sessions/${session.session_id}`)); await loadProducts(); } catch { /* Keep the failed operation visible. */ }
      return false;
    } finally { operation.current = false; setBusy(false); }
  };
  return { session, products, error, busy, loading, refresh, mutate };
}
