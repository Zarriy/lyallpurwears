// Read-only summary panel pinned to the top of an order in Studio.
//
// Fulfilling an order means answering four questions fast: who, what, where,
// how much to collect. Scrolling a column of individual fields to assemble
// that is slow and error-prone — a packer mis-reads a quantity, a rider is
// given the wrong cash figure. This renders it once, laid out like a docket.
//
// Purely presentational: it reads the parent document and writes nothing.
import { useFormValue } from 'sanity';

const money = (n) => (typeof n === 'number' ? `Rs. ${n.toLocaleString('en-PK')}` : '—');

const STATUS_TONE = {
  new: { bg: '#FDF4E3', fg: '#8A6A1F', label: 'New' },
  confirmed: { bg: '#EAF3FB', fg: '#245C87', label: 'Confirmed' },
  packed: { bg: '#EAF3FB', fg: '#245C87', label: 'Packed' },
  shipped: { bg: '#EDF3EA', fg: '#3F6B34', label: 'Shipped' },
  delivered: { bg: '#E8F1E6', fg: '#2F5C28', label: 'Delivered' },
  cancelled: { bg: '#FBEDED', fg: '#8E3B38', label: 'Cancelled' },
  returned: { bg: '#F3F0EC', fg: '#6B6B6B', label: 'Returned' },
};

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '5px 0', fontSize: 13, lineHeight: 1.5 }}>
      <span style={{ minWidth: 88, color: '#8A8A8A', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#1A1A1A', wordBreak: 'break-word' }}>{children || '—'}</span>
    </div>
  );
}

export function OrderSummary() {
  const doc = useFormValue([]) || {};
  const {
    orderNumber, status, placedAt, customer = {}, shippingAddress = {},
    lines = [], subtotal, discountCode, discountAmount, shipping, taxes, total,
    confirmationEmail,
  } = doc;

  const tone = STATUS_TONE[status] || STATUS_TONE.new;
  const who = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || '—';
  const address = [shippingAddress.address, shippingAddress.apartment, shippingAddress.city, shippingAddress.postalCode]
    .filter(Boolean)
    .join(', ');
  const placed = placedAt
    ? new Date(placedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  // wa.me wants bare digits.
  const waDigits = String(customer.phone || '').replace(/\D/g, '');

  return (
    <div style={{ border: '1px solid #E3E4E8', borderRadius: 6, overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header — order number, status, and the cash figure the rider collects */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '16px 18px', background: '#FAFAF7', borderBottom: '1px solid #E3E4E8', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: '#0A0A0A', letterSpacing: '0.02em' }}>
              {orderNumber || 'Draft order'}
            </span>
            <span style={{ background: tone.bg, color: tone.fg, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 3 }}>
              {tone.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 5 }}>{placed}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#8A8A8A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Collect on delivery</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', marginTop: 3 }}>{money(total)}</div>
        </div>
      </div>

      {/* Who + where */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 0 }}>
        <div style={{ padding: '14px 18px', borderRight: '1px solid #E3E4E8', borderBottom: '1px solid #E3E4E8' }}>
          <div style={{ fontSize: 10, color: '#8A8A8A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Customer</div>
          <Row label="Name">{who}</Row>
          <Row label="Email">{customer.email}</Row>
          <Row label="Phone">
            {customer.phone ? (
              waDigits ? (
                <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" style={{ color: '#245C87' }}>
                  {customer.phone}
                </a>
              ) : (
                customer.phone
              )
            ) : (
              <span style={{ color: '#8E3B38' }}>Not given — rider cannot call</span>
            )}
          </Row>
        </div>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E3E4E8' }}>
          <div style={{ fontSize: 10, color: '#8A8A8A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Ship to</div>
          <Row label="Address">{address}</Row>
          <Row label="Country">{shippingAddress.country}</Row>
        </div>
      </div>

      {/* Packing list */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #E3E4E8' }}>
        <div style={{ fontSize: 10, color: '#8A8A8A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          Pack {lines.length} {lines.length === 1 ? 'item' : 'items'}
        </div>
        {lines.map((l, i) => (
          <div key={l._key || i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '7px 0', borderTop: i ? '1px solid #F0F0EE' : 'none' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', minWidth: 28 }}>{l.qty}×</span>
            <span style={{ flex: 1, fontSize: 13, color: '#1A1A1A' }}>
              {l.productName}
              <span style={{ color: '#8A8A8A' }}>
                {' — '}
                {[l.fabric, l.stitching, l.colour].filter(Boolean).join(' · ')}
              </span>
            </span>
            <span style={{ fontSize: 13, color: '#1A1A1A', whiteSpace: 'nowrap' }}>{money(l.lineTotal)}</span>
          </div>
        ))}
      </div>

      {/* Money */}
      <div style={{ padding: '14px 18px', background: '#FAFAF7' }}>
        <Row label="Subtotal">{money(subtotal)}</Row>
        {discountAmount > 0 && <Row label="Discount">−{money(discountAmount)}{discountCode ? ` (${discountCode})` : ''}</Row>}
        <Row label="Shipping">{shipping === 0 ? 'Free' : money(shipping)}</Row>
        {taxes > 0 && <Row label="Taxes">{money(taxes)}</Row>}
        <div style={{ display: 'flex', gap: 12, paddingTop: 9, marginTop: 6, borderTop: '1px solid #E3E4E8', fontSize: 14, fontWeight: 600 }}>
          <span style={{ minWidth: 88, color: '#1A1A1A' }}>Total</span>
          <span style={{ color: '#0A0A0A' }}>{money(total)}</span>
        </div>
      </div>

      {/* Whether the customer actually got their confirmation. Surfaced here
          because a silent failure means they have no record of the order. */}
      {confirmationEmail && (
        <div
          style={{
            padding: '10px 18px',
            fontSize: 12,
            borderTop: '1px solid #E3E4E8',
            background: confirmationEmail.status === 'sent' ? '#F4F8F3' : '#FBEDED',
            color: confirmationEmail.status === 'sent' ? '#3F6B34' : '#8E3B38',
          }}
        >
          {confirmationEmail.status === 'sent'
            ? `Confirmation emailed to the customer${confirmationEmail.provider ? ` via ${confirmationEmail.provider}` : ''}.`
            : 'Confirmation email FAILED — the customer has no record of this order. Contact them directly.'}
        </div>
      )}
    </div>
  );
}
