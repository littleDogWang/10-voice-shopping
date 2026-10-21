'use client';

import { useState } from 'react';
import { Camera, Check, Mic, Package, ShoppingBag, SlidersHorizontal, Trash2 } from 'lucide-react';
import type { useShopping } from '@/hooks/use-shopping';
import type { ShoppingOrder, CartQuote } from '@/scenarios/09-voice-shopping/shopping-types';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

function OrderLines({ quote }: { quote: CartQuote }) {
  return <><ul className="shopping-order-lines">{quote.items.map(item => <li key={item.product_id}><div><strong>{item.name}</strong><small>{item.quantity} × {money(item.unit_price)}</small></div><span>{money(item.subtotal)}</span></li>)}</ul>
    <div className="shopping-total"><span>Total · USD</span><strong>{money(quote.total)}</strong></div></>;
}

type Shopping = ReturnType<typeof useShopping>;
export function ShoppingWorkbench({ shopping, embedded = false }: { shopping: Shopping; embedded?: boolean }) {
  const { session, products, error, busy, loading, mutate, refresh } = shopping;
  const [category, setCategory] = useState('microphone');
  const [budget, setBudget] = useState('');
  const [attribute, setAttribute] = useState('');
  const [comparison, setComparison] = useState<string[]>([]);
  const [review, setReview] = useState<CartQuote | null>(null);
  const [cancel, setCancel] = useState<ShoppingOrder | null>(null);
  const visible = products.filter(product => product.category === category && (!budget || product.price <= Number(budget))
    && (!attribute || product.attributes.includes(attribute))).sort((a, b) => a.price - b.price);
  const attributes = [...new Set(products.filter(product => product.category === category).flatMap(product => product.attributes))];
  const compared = products.filter(product => comparison.includes(product.productId));
  const disabled = busy || loading || !session;
  const quantity = (id: string) => session?.cart?.items.find(item => item.product_id === id)?.quantity ?? 0;

  return <div className={embedded ? "shopping-page shopping-embedded" : "shopping-page"}>
    <main className="shopping-layout">
      <div className="shopping-content">
        {error && <div className="shopping-error" role="alert"><p>{error}</p><Button variant="outline" size="sm" disabled={busy} onClick={() => session ? void refresh() : location.reload()}>Try Again</Button></div>}
        <section className="shopping-catalog" aria-labelledby="catalog-heading"><div className="shopping-section-heading"><div><span className="shopping-eyebrow">01 / FIND YOUR FIT</span><h2 id="catalog-heading">Choose your setup</h2></div><span className="shopping-muted">Fixed example catalog · USD</span></div>
          <div className="shopping-filters"><div className="shopping-tabs" aria-label="Product category"><Button variant={category === 'microphone' ? 'default' : 'ghost'} aria-pressed={category === 'microphone'} onClick={() => { setCategory('microphone'); setAttribute(''); setComparison([]); }}><Mic size={16} />Microphones</Button><Button variant={category === 'camera' ? 'default' : 'ghost'} aria-pressed={category === 'camera'} onClick={() => { setCategory('camera'); setAttribute(''); setComparison([]); }}><Camera size={16} />Cameras</Button></div>
            <label>Budget, USD<input type="number" min="0" value={budget} placeholder="Any budget" onChange={event => setBudget(event.target.value)} /></label>
            <label>Preference<select value={attribute} onChange={event => setAttribute(event.target.value)}><option value="">Any feature</option>{attributes.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          </div>
          {loading ? <p role="status">Loading your shopping session…</p> : <div className="shopping-products">{visible.map(product => <article key={product.productId} className="shopping-product"><div className="shopping-product-top"><div className="shopping-product-icon">{category === 'microphone' ? <Mic size={28} /> : <Camera size={28} />}</div><label className="shopping-compare-check"><input type="checkbox" checked={comparison.includes(product.productId)} onChange={event => setComparison(current => event.target.checked ? [...current, product.productId] : current.filter(id => id !== product.productId))} />Compare<span className="sr-only"> {product.name}</span></label></div>
            <span className="shopping-product-id">{product.productId}</span><h3>{product.name}</h3><strong className="shopping-price">{money(product.price)}</strong><ul className="shopping-attributes">{product.attributes.map(value => <li key={value}><Check size={13} />{value}</li>)}</ul>
            <div className="shopping-product-footer"><span className={product.stock ? 'shopping-muted' : 'shopping-out-of-stock'}>{product.stock ? `${product.stock} available` : 'Out of stock'}</span><Button variant="outline" disabled={disabled || !product.stock || quantity(product.productId) >= Math.min(10, product.stock)} onClick={() => void mutate('/cart', { product_id: product.productId, quantity: quantity(product.productId) + 1 })}><ShoppingBag size={14} />{quantity(product.productId) ? 'Add another' : 'Add to Basket'}</Button></div>
          </article>)}</div>}
          {!loading && !visible.length && <div className="shopping-empty"><SlidersHorizontal size={22} /><h3>No matches at these settings.</h3><p>Increase your budget or choose another feature.</p><Button variant="outline" onClick={() => { setBudget(''); setAttribute(''); }}>Reset Filters</Button></div>}
          {compared.length >= 2 && <div className="shopping-comparison"><h3>Compare your choices</h3><div className="shopping-table-scroll"><table><caption className="sr-only">Product price, features and availability comparison</caption><thead><tr><th>Product</th><th>Price</th><th>Features</th><th>Available</th></tr></thead><tbody>{compared.map(product => <tr key={product.productId}><th>{product.name}</th><td>{money(product.price)}</td><td>{product.attributes.join(', ')}</td><td>{product.stock || 'Out of stock'}</td></tr>)}</tbody></table></div></div>}
        </section>
        <div className="shopping-checkout-grid">
          <section className="shopping-card" aria-labelledby="basket-heading"><span className="shopping-eyebrow">02 / REVIEW & CONFIRM</span><div className="shopping-section-heading"><h2 id="basket-heading">Your basket</h2><ShoppingBag size={18} /></div>
            {session?.cart ? <><ul className="shopping-cart">{session.cart.items.map(item => <li key={item.product_id}><div><strong>{item.name}</strong><small>{money(item.unit_price)} each</small></div><label><span className="sr-only">Quantity for {item.name}</span><select value={item.quantity} disabled={disabled} onChange={event => void mutate('/cart', { product_id: item.product_id, quantity: Number(event.target.value) })}>{Array.from({ length: 10 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}</select></label><Button variant="ghost" size="icon" disabled={disabled} aria-label={`Remove ${item.name}`} onClick={() => void mutate('/cart', { product_id: item.product_id, quantity: 0 })}><Trash2 size={15} /></Button></li>)}</ul>
              <div className="shopping-total"><span>Total · USD</span><strong>{money(session.cart.total)}</strong></div><p className="shopping-muted">No payment will be collected.</p><Button className="shopping-full" disabled={disabled} onClick={() => setReview(session.cart)}>Review Order</Button></> : <div className="shopping-empty shopping-empty-small"><ShoppingBag size={24} /><p>Your basket is empty.</p><small>Choose a product above or ask the assistant.</small></div>}
          </section>
          <section className="shopping-card" aria-labelledby="orders-heading"><span className="shopping-eyebrow">03 / YOUR NEXT STEP</span><div className="shopping-section-heading"><h2 id="orders-heading">Saved orders</h2><Button variant="ghost" size="sm" disabled={disabled} onClick={() => void refresh()}>Refresh Orders</Button></div>
            {!session?.orders.length ? <div className="shopping-empty shopping-empty-small"><Package size={24} /><p>No orders yet.</p><small>A confirmed order appears here with its number and status.</small></div> : session.orders.map(order => <article key={order.order_id} className="shopping-order"><div className="shopping-section-heading"><strong className="shopping-order-number">{order.order_id}</strong><span className={`shopping-badge ${order.status === 'cancelled' ? 'shopping-badge-muted' : ''}`}>{order.status === 'unpaid' ? 'Unpaid' : 'Cancelled'}</span></div><OrderLines quote={order} /><p className="shopping-muted">Saved {new Date(order.created_at).toLocaleString('en-US')}</p>{order.status === 'unpaid' ? <><p className="shopping-muted">Saved only. No payment or shipment is scheduled.</p><Button variant="outline" size="sm" disabled={disabled} onClick={() => setCancel(order)}>Cancel Order<span className="sr-only"> {order.order_id}</span></Button></> : <p className="shopping-muted">Cancelled. No charge was made.</p>}</article>)}
          </section>
        </div>
        <footer className="shopping-disclosure">Fictional products and simulated inventory. Orders are saved locally and remain unpaid. No real purchase, delivery or refund.</footer>
      </div>
    </main>
    <Dialog open={!!review} onOpenChange={open => { if (!open && !busy) setReview(null); }}><DialogContent className="shopping-dialog"><DialogHeader><DialogTitle>Confirm Your Order</DialogTitle><DialogDescription>Check the items, quantities and total. This saves an unpaid simulated order.</DialogDescription></DialogHeader>{review && <OrderLines quote={review} />}<p className="shopping-muted">No payment will be collected. No shipment will be arranged.</p><DialogFooter><Button variant="outline" disabled={busy} onClick={() => setReview(null)}>Keep Editing</Button><Button disabled={busy || !review || review.quote_id !== session?.cart?.quote_id} onClick={async () => { if (review) { await mutate('/orders', { quote_id: review.quote_id, confirmed: true }); setReview(null); } }}>{busy ? 'Saving…' : 'Confirm Unpaid Order'}</Button></DialogFooter>{review && review.quote_id !== session?.cart?.quote_id && <p role="alert">Your basket changed. Close this summary and review the latest basket.</p>}</DialogContent></Dialog>
    <Dialog open={!!cancel} onOpenChange={open => { if (!open && !busy) setCancel(null); }}><DialogContent className="shopping-dialog"><DialogHeader><DialogTitle>Cancel This Order?</DialogTitle><DialogDescription>Cancel {cancel?.order_id} and release its simulated stock. No refund is needed because this order is unpaid.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" disabled={busy} onClick={() => setCancel(null)}>Keep Order</Button><Button variant="destructive" disabled={busy} onClick={async () => { if (cancel) { await mutate(`/orders/${cancel.order_id}`, { confirmed: true }); setCancel(null); } }}>{busy ? 'Cancelling…' : 'Confirm Cancellation'}</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
