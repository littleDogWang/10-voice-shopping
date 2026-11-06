'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Camera, Check, Loader2, Search, Store } from 'lucide-react';
import type { CatalogMoney, CatalogProduct, CatalogSearchResult } from '@/types/shopify';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

function price(value: CatalogMoney | null) {
  if (!value) return 'Price unavailable';
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: value.currency });
  return formatter.format(value.amount / 10 ** (formatter.resolvedOptions().maximumFractionDigits ?? 2));
}

function availability(value: boolean | null) {
  return value === true ? 'Available' : value === false ? 'Unavailable' : 'Availability unknown';
}

function ProductImage({ product }: { product: Pick<CatalogProduct, 'imageUrl' | 'title'> }) {
  const [failed, setFailed] = useState(false);
  return <div className="catalog-image">
    {product.imageUrl && !failed ? (
      // Shopify requires direct merchant image URLs without optimization or a local image cache.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={product.imageUrl} alt={product.title} loading="lazy" onError={() => setFailed(true)} />
    ) : <Camera size={32} aria-label="Product image unavailable" />}
  </div>;
}

export function ShopifyCatalog({ onDiscuss }: { onDiscuss?: (id: string, label: string, budget?: number) => Promise<void> }) {
  const [query, setQuery] = useState('USB microphone');
  const [budget, setBudget] = useState('150');
  const [results, setResults] = useState<CatalogSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CatalogProduct | null>(null);
  const [detailError, setDetailError] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [variantId, setVariantId] = useState('');
  const [discussBusy, setDiscussBusy] = useState(false);
  const [discussError, setDiscussError] = useState('');
  const searchRequest = useRef<AbortController | null>(null);
  const detailRequest = useRef<AbortController | null>(null);

  useEffect(() => () => { searchRequest.current?.abort(); detailRequest.current?.abort(); }, []);

  async function search(event: FormEvent) {
    event.preventDefault();
    searchRequest.current?.abort();
    const controller = new AbortController();
    searchRequest.current = controller;
    setLoading(true); setError(''); setResults(null);
    try {
      const params = new URLSearchParams({ q: query });
      if (budget) params.set('budget', budget);
      const response = await fetch('/api/catalog/search?' + params, { cache: 'no-store', signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not search products. Please try again.');
      if (!controller.signal.aborted) setResults(data);
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Could not search products. Please try again.');
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }

  async function showDetails(id: string) {
    detailRequest.current?.abort();
    const controller = new AbortController();
    detailRequest.current = controller;
    setDetailId(id); setDetail(null); setDetailError(''); setDiscussError(''); setDetailLoading(true); setVariantId('');
    try {
      const response = await fetch('/api/catalog/product?' + new URLSearchParams({ id }), { cache: 'no-store', signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load this product. Please try again.');
      if (!controller.signal.aborted) {
        const product: CatalogProduct = data.product;
        setDetail(product);
        setVariantId(product.variants.find(value => value.productUrl === product.productUrl)?.id || product.variants[0]?.id || '');
      }
    } catch (error) {
      if (!controller.signal.aborted) setDetailError(error instanceof Error ? error.message : 'Could not load this product. Please try again.');
    } finally { if (!controller.signal.aborted) setDetailLoading(false); }
  }

  const selected = detail?.variants.find(value => value.id === variantId);
  const selectedPrice = selected ? selected.price : detail?.price ?? null;
  const productUrl = selected ? selected.productUrl : detail?.productUrl;
  const checkoutUrl = selected ? selected.checkoutUrl : detail?.checkoutUrl;
  const selectedAvailability = selected ? selected.available : detail?.available ?? null;
  const selectedMerchant = selected?.merchant || detail?.merchant;
  const selectedImage = selected?.imageUrl ?? detail?.imageUrl ?? null;
  const selectedDescription = selected?.description || detail?.description;
  const overBudget = !!budget && selectedPrice?.currency === 'USD' && selectedPrice.amount > Number(budget) * 100;

  return <>
    <section id="products" className="catalog-browser" aria-labelledby="catalog-heading">
      <div className="catalog-heading">
        <div><span className="catalog-source"><Store size={14} />Shopify Catalog</span><h2 id="catalog-heading">Find a setup that fits.</h2><p>Browse real microphones and cameras from independent stores.</p></div>
        <span className="catalog-market">U.S. delivery · USD</span>
      </div>
      <form className="catalog-search" onSubmit={search}>
        <label className="catalog-query">What are you looking for?<div className="catalog-input"><Search size={17} aria-hidden="true" /><input aria-label="Product search" value={query} onChange={event => setQuery(event.target.value)} required maxLength={180} placeholder="USB microphone for video calls" /></div></label>
        <label>Budget, USD<input aria-label="Maximum budget in USD" type="number" min="0.01" max="100000" step="0.01" value={budget} onChange={event => setBudget(event.target.value)} placeholder="Any budget" /></label>
        <Button type="submit" disabled={loading} aria-busy={loading}>{loading ? <Loader2 className="animate-spin" /> : <Search />}{loading ? 'Searching…' : 'Search products'}</Button>
      </form>
      <div className="catalog-suggestions"><span>Try</span>{['USB microphone', 'Webcam for video calls', '4K camera'].map(value => <button type="button" key={value} onClick={() => setQuery(value)}>{value}</button>)}</div>
      <div className="catalog-results" aria-busy={loading}>
        {error ? <Alert variant="destructive"><AlertDescription>{error} Use Search products to retry.</AlertDescription></Alert> : null}
        {loading ? <div className="catalog-state" role="status"><Loader2 className="animate-spin" size={24} /><h3>Finding current offers…</h3><p>Checking product information from Shopify stores.</p></div> : null}
        {!loading && !error && !results ? <div className="catalog-state catalog-initial"><Search size={24} /><h3>Your next recommendation starts here.</h3><p>Set a budget and search, or start a voice conversation above.</p></div> : null}
        {results ? <>
          <p className="catalog-result-count" role="status">{results.products.length ? `${results.products.length} matches for “${results.query}”` : `No matches for “${results.query}”`}</p>
          {!results.products.length ? <div className="catalog-state"><Search size={24} /><h3>No products at these settings.</h3><p>Try a broader search or adjust your budget.</p></div> : <div className="catalog-grid">{results.products.map(product => <article className="catalog-product" key={product.id}>
            <ProductImage product={product} />
            <div className="catalog-product-body"><span className="catalog-merchant">{product.merchant}</span><h3 title={product.title}>{product.title}</h3><strong className="catalog-price">{price(product.price)}</strong><span className="catalog-availability">{product.available === true ? <Check size={13} /> : null}{availability(product.available)}</span>
              <div className="catalog-product-actions"><Button variant="outline" size="sm" onClick={() => void showDetails(product.id)}>View details</Button>{product.productUrl ? <a href={product.productUrl} target="_blank" rel="noopener noreferrer">View product<ArrowUpRight size={14} /></a> : null}</div>
            </div>
          </article>)}</div>}
        </> : null}
      </div>
      <p className="catalog-footnote">Prices and availability are checked when you search. Tax, shipping and final totals are confirmed by the merchant.</p>
    </section>
    <Dialog open={detailId !== null} onOpenChange={open => { if (!open) { detailRequest.current?.abort(); setDetailId(null); setDetail(null); setDetailError(''); } }}>
      <DialogContent className="catalog-detail"><DialogHeader><DialogTitle>{detail?.title || 'Product details'}</DialogTitle><DialogDescription>{detail ? selectedMerchant : 'Checking current product information.'}</DialogDescription></DialogHeader>
        {detailLoading ? <div className="catalog-state" role="status"><Loader2 className="animate-spin" /><p>Checking the latest details…</p></div> : null}
        {detailError ? <><Alert variant="destructive"><AlertDescription>{detailError}</AlertDescription></Alert><Button variant="outline" onClick={() => { if (detailId) void showDetails(detailId); }}>Retry product lookup</Button></> : null}
        {detail ? <div className="catalog-detail-grid"><ProductImage key={variantId || detail.id} product={{ imageUrl: selectedImage, title: selected?.title || detail.title }} /><div className="catalog-detail-copy">
          <strong className="catalog-price">{price(selectedPrice)}</strong><span className="catalog-availability">{availability(selectedAvailability)}</span>
          {detail.variants.length > 1 ? <label>Choose an option<select value={variantId} onChange={event => setVariantId(event.target.value)}>{detail.variants.map(value => <option key={value.id} value={value.id}>{value.title}{value.price ? ' · ' + price(value.price) : ''}</option>)}</select></label> : null}
          {selected?.options.length ? <dl className="catalog-options">{selected.options.map(value => <div key={value.name}><dt>{value.name}</dt><dd>{value.label}</dd></div>)}</dl> : null}
          {selectedDescription ? <p className="catalog-description">{selectedDescription}</p> : null}
          {overBudget ? <p className="catalog-budget-note">This option is above your current USD budget.</p> : null}
          <div className="catalog-detail-actions">{productUrl ? <Button variant="outline" asChild><a href={productUrl} target="_blank" rel="noopener noreferrer">View at store<ArrowUpRight /></a></Button> : null}{checkoutUrl && selectedAvailability !== false ? <Button asChild><a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Continue to merchant<ArrowUpRight /></a></Button> : null}</div>
          <Button variant="outline" disabled={!onDiscuss || discussBusy} onClick={async () => {
            if (!onDiscuss) return;
            setDiscussBusy(true); setDiscussError('');
            try {
              const optionLabel = selected?.options.map(value => value.label).join(', ');
              const label = detail.title + (optionLabel ? ' (' + optionLabel + ')' : '') + ' from ' + selectedMerchant;
              await onDiscuss(selected?.id || detail.id, label, budget ? Number(budget) : undefined);
            }
            catch { setDiscussError('The voice assistant could not receive this product. Check the voice connection and try again.'); }
            finally { setDiscussBusy(false); }
          }}>{discussBusy ? 'Sending to assistant…' : 'Discuss by voice'}</Button>
          {!onDiscuss ? <p className="catalog-footnote">Start voice shopping above to discuss this product with the assistant.</p> : null}
          {discussError ? <p role="alert" className="catalog-footnote">{discussError}</p> : null}
          <p className="catalog-footnote">Complete any purchase on the merchant website. Catalog descriptions may be inferred; check the store for exact compatibility.</p>
        </div></div> : null}
      </DialogContent>
    </Dialog>
  </>;
}
