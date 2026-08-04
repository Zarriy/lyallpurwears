// Privacy Policy — replaces a dead "#" anchor in the footer bottom bar.
//
// NOTE FOR THE OWNER: this is written to describe how the store actually
// behaves today (COD-first, WhatsApp support, courier handoff) rather than
// generic boilerplate, but it has not been reviewed by a lawyer. Before
// trading at volume, have it checked against Pakistan's Personal Data
// Protection Bill as enacted, and fill in the registered business name and
// address in COMPANY below.
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

export default function Privacy() {
  const { settings } = useStore();
  const email = settings?.contactEmail || DEFAULT_EMAIL;

  return (
    <div>
      <PageHero
        kicker="Privacy Policy"
        title="What we keep,"
        accent="and why."
        lede="We collect the least we can get away with, and we have never sold a customer list. This page says exactly what we hold and who else sees it."
      >
        <div style={{ marginTop: 28, fontFamily: 'var(--mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--track-wide)', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Last updated · {LAST_UPDATED}
        </div>
      </PageHero>

      <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
        <Reveal>
          <div style={{ maxWidth: 760 }}>
            <Section title="Who we are">
              <p>
                {COMPANY}. If you have a question about anything on this page, write to{' '}
                <a href={`mailto:${email}`} style={{ borderBottom: '1px solid var(--line)' }}>{email}</a> and
                a person will answer it.
              </p>
            </Section>

            <Section title="What we collect">
              <ul>
                <li><strong>To fulfil an order:</strong> your name, delivery address, phone number and email address.</li>
                <li><strong>Order details:</strong> what you bought, what you paid, and any measurements or notes you send us for stitching.</li>
                <li><strong>Correspondence:</strong> messages you send us by WhatsApp, email or the contact form, kept so we can pick up a conversation where it left off.</li>
                <li><strong>Basic site analytics:</strong> pages visited and rough location, in aggregate, so we know which collections people actually look at.</li>
              </ul>
              <p>
                We do not collect or store card numbers. Card payments are handled entirely by our
                payment processor; we see only whether a payment succeeded and the last four digits.
              </p>
            </Section>

            <Section title="Why we hold it">
              <p>
                To take, pack, deliver and — where necessary — refund your order; to answer your
                messages; to meet tax and accounting obligations; and, if you have asked for the
                letter, to send you it. That is the whole list.
              </p>
              <p>
                We do not build advertising profiles, and we do not sell, rent or trade your details
                to anyone. If that ever changes we will say so here first, and it will be opt-in.
              </p>
            </Section>

            <Section title="Who else sees it">
              <ul>
                <li><strong>Couriers</strong> — your name, address and phone number, because a parcel cannot be delivered without them.</li>
                <li><strong>Payment processors</strong> — for card and wallet transactions, handled directly between you and them.</li>
                <li><strong>Our email and hosting providers</strong> — as the systems that store the data on our behalf.</li>
              </ul>
              <p>
                Each of these gets only what it needs to do its job. We will also disclose
                information if a Pakistani court or regulator lawfully requires it of us.
              </p>
            </Section>

            <Section title="How long we keep it">
              <p>
                Order records are kept for seven years, which is what tax law requires of us.
                Marketing contacts are kept until you unsubscribe. WhatsApp and email threads are
                kept for two years, then deleted. Analytics are aggregated and hold nothing that
                identifies you individually.
              </p>
            </Section>

            <Section title="Cookies">
              <p>
                The site sets a small number of cookies and local-storage entries: one to remember
                what is in your cart between visits, and analytics cookies to count visits. There is
                no advertising or cross-site tracking on this site. Clearing your browser storage
                removes all of it — you will just lose your cart.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                Write to us and you can ask for a copy of everything we hold on you, a correction to
                anything wrong, or deletion of your details. We will action it within thirty days.
                Deletion is limited only by the order records we are legally required to retain — we
                will tell you which those are rather than refusing outright.
              </p>
              <p>
                You can unsubscribe from the letter using the link at the foot of any email, or by
                replying with the word "stop". It takes effect immediately, and it does not affect
                messages about an order already placed.
              </p>
            </Section>

            <Section title="Changes to this policy">
              <p>
                If we change how we handle your information we will update this page and move the
                date at the top of it. Material changes will also go out on the letter.
              </p>
            </Section>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn-outline" to="/terms">Terms of Service</Link>
              <Link className="btn btn-outline" to="/contact">Ask us a question</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
