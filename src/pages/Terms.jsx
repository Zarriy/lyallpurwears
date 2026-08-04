// Terms of Service — replaces a dead "#" anchor in the footer bottom bar.
//
// NOTE FOR THE OWNER: written to match how the store actually operates (COD,
// short runs, unstitched cloth, 7-day returns) rather than generic boilerplate,
// but not reviewed by a lawyer. Have it checked before trading at volume, and
// fill in the registered business name, NTN and address in COMPANY below.
import { Link } from 'react-router-dom';
import { Reveal, PageHero } from '../components/primitives.jsx';
import { useStore } from '../sanity/useStore.js';

const LAST_UPDATED = '4 August 2026';
const DEFAULT_EMAIL = 'hello@lyallpurwear.pk';
const COMPANY = 'Lyallpur Wear, D Ground, Faisalabad (Lyallpur), Pakistan';

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 className="serif-display" style={{ fontSize: 32, marginBottom: 16 }}>{title}</h2>
      <div className="prose">{children}</div>
    </div>
  );
}

export default function Terms() {
  const { settings } = useStore();
  const email = settings?.contactEmail || DEFAULT_EMAIL;

  return (
    <div>
      <PageHero
        kicker="Terms of Service"
        title="The agreement,"
        accent="in plain words."
        lede="What you can expect from us and what we need from you. Written to be read, not to be survived."
      >
        <div style={{ marginTop: 28, fontFamily: 'var(--mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--track-wide)', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Last updated · {LAST_UPDATED}
        </div>
      </PageHero>

      <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
        <Reveal>
          <div style={{ maxWidth: 760 }}>
            <Section title="1 · Who you are buying from">
              <p>
                This site is operated by {COMPANY}. Placing an order means you accept the terms on
                this page. We are a retailer: we buy finished cloth from mills, block-printers and
                wholesalers and sell it under our own name. We are not the manufacturer of the goods
                we sell, and we do not present ourselves as one.
              </p>
            </Section>

            <Section title="2 · Orders">
              <p>
                An order is an offer to buy. The contract forms when we send you a dispatch
                confirmation, not when you check out — until then we may decline or cancel an order,
                for example if the item has sold out or a price was listed in error. If we cancel,
                you are refunded in full and immediately.
              </p>
              <p>
                You may change or cancel an order yourself at any point before it is dispatched.
                After dispatch, it becomes a return.
              </p>
            </Section>

            <Section title="3 · Prices and availability">
              <p>
                All prices are in Pakistani Rupees and include applicable taxes. Delivery is charged
                separately and shown before you pay.
              </p>
              <p>
                We buy in short runs, so stock counts are genuine and colourways frequently do not
                return once sold through. Occasionally two orders land on the last article at the
                same moment; if that happens we will tell you within one working day and refund in
                full rather than substituting anything.
              </p>
            </Section>

            <Section title="4 · Payment">
              <p>
                We accept Cash on Delivery anywhere in Pakistan, bank transfer, Easypaisa, JazzCash,
                and debit and credit cards. Card details are handled by our payment processor and
                never reach our systems.
              </p>
              <p>
                On COD orders you pay the courier in full at the door. Repeatedly refusing delivery
                of COD parcels may mean we ask for advance payment on future orders.
              </p>
            </Section>

            <Section title="5 · Delivery">
              <p>
                We dispatch from Faisalabad, normally within one working day, and transit is usually
                two to four working days nationwide. Those times are estimates, not guarantees —
                courier networks slow around Eid and in bad weather, and we cannot control that.
              </p>
              <p>
                Risk in the goods passes to you on delivery. If a parcel arrives damaged, photograph
                it and tell us the same day and we will replace or refund it at our cost.
              </p>
            </Section>

            <Section title="6 · Colour, cloth and unstitched goods">
              <p>
                Screens differ. We photograph the actual cloth in daylight without retouching the
                colour, but a shade may still read differently on your monitor, and that on its own
                is a reason to return something rather than a defect.
              </p>
              <p>
                Hand block-printed cloth carries irregularities in the repeat, slight variation in
                dye depth, and occasional small marks from the print table. These are characteristics
                of the process, not faults, and are not grounds for a claim of defect — though they
                are still covered by the ordinary right of return below.
              </p>
              <p>
                Unstitched cloth is sold by measured length. Once it has been cut, washed or stitched
                it cannot be returned, because we can no longer sell it. Check the cloth before you
                take it to a tailor.
              </p>
            </Section>

            <Section title="7 · Returns">
              <p>
                Seven days from delivery, on unworn and unwashed pieces with tags attached, and on
                unstitched cloth that has not been cut. The full policy — including exchanges,
                refund timings and what we cannot accept — is set out on the{' '}
                <Link to="/shipping-returns" style={{ borderBottom: '1px solid var(--line)' }}>
                  Shipping &amp; Returns
                </Link>{' '}
                page and forms part of these terms.
              </p>
            </Section>

            <Section title="8 · Stitching service">
              <p>
                Where you order a piece stitched, you are responsible for the measurements you give
                us. If the finished garment does not match those measurements, we alter or remake it
                at our cost. If the measurements themselves were wrong, we will still alter it once
                and charge only the tailoring. Stitched-to-measure pieces are otherwise not
                returnable.
              </p>
            </Section>

            <Section title="9 · Using this site">
              <p>
                The photography, text and design on this site are ours and may not be copied for
                commercial use without permission. Product names and descriptions may be quoted for
                review or reference.
              </p>
              <p>
                Please do not attempt to disrupt the site, scrape it at volume, or place orders
                fraudulently. We reserve the right to refuse service where we reasonably suspect any
                of these.
              </p>
            </Section>

            <Section title="10 · Liability">
              <p>
                Our liability for any order is limited to the amount you paid for it, plus delivery.
                We are not liable for indirect losses. Nothing here limits liability for death,
                personal injury or fraud, and nothing here affects your statutory rights as a
                consumer under Pakistani law.
              </p>
            </Section>

            <Section title="11 · Governing law">
              <p>
                These terms are governed by the laws of the Islamic Republic of Pakistan, and the
                courts at Faisalabad have jurisdiction over any dispute. We would much rather settle
                it over a phone call first — write to{' '}
                <a href={`mailto:${email}`} style={{ borderBottom: '1px solid var(--line)' }}>{email}</a>.
              </p>
            </Section>

            <Section title="12 · Changes">
              <p>
                We may update these terms; the date at the top of the page shows when we last did.
                The terms that apply to your order are the ones published when you placed it.
              </p>
            </Section>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn-outline" to="/privacy">Privacy Policy</Link>
              <Link className="btn btn-outline" to="/shipping-returns">Shipping &amp; Returns</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
