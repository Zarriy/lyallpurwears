// FAQ — the long version. Contact.jsx keeps its own five-question summary and
// links here. The "About us" group deliberately leads with the sourcing
// question, because it is the one the About page exists to answer and the one
// a customer is most entitled to a straight answer on.
import { Link } from 'react-router-dom';
import { Reveal, PageHero, Accordion, TrustStrip } from '../components/primitives.jsx';

const GROUPS = [
  {
    title: 'Orders & payment',
    items: [
      { title: 'Is Cash on Delivery available?', body: 'Yes, anywhere in Pakistan and at no extra charge. You pay the courier at your door. On orders above Rs. 25,000 we may ask for a partial advance first.' },
      { title: 'What else can I pay with?', body: 'Bank transfer, Easypaisa and JazzCash, plus debit and credit cards at checkout. Bank and wallet transfers are confirmed manually, which can add a few hours before dispatch.' },
      { title: 'Can I change or cancel an order?', body: 'Until it is dispatched, yes — message us with the order number and we will amend or cancel it. Once the courier has it, treat it as a return.' },
      { title: 'Do you restock sold-out colourways?', body: 'Usually not. We buy short runs of whatever the mill actually has, so when a colourway sells through it generally does not come back. Occasionally we find the same lot again; the letter is where we announce it.' },
      { title: 'Do you sell wholesale?', body: 'In small quantities, yes, for boutiques within Pakistan. Email us rather than using the order form and tell us roughly what volumes you are thinking about.' },
    ],
  },
  {
    title: 'Shipping',
    items: [
      { title: 'How long does delivery take?', body: 'Two to four working days nationwide from dispatch, and four to seven on remote routes. Stitched-to-measure orders add five to nine working days before they ship.' },
      { title: 'What does shipping cost?', body: 'Nothing — delivery is free on every order, anywhere in Pakistan. There is no minimum.' },
      { title: 'Do you ship internationally?', body: 'Not yet — Pakistan only for now. We are working on Gulf and UK rates.' },
      { title: 'How do I track my parcel?', body: 'Your dispatch message carries a tracking link, or use the Track Order page with your order number.' },
    ],
  },
  {
    title: 'Returns & exchanges',
    items: [
      { title: 'What is your returns policy?', body: 'Seven days from delivery on unworn, unwashed pieces with tags attached, and on unstitched cloth that has not been cut. We do not ask you to justify a return.' },
      { title: 'What cannot be returned?', body: 'Anything cut, stitched or altered; anything washed or worn; stitched-to-measure orders unless the fault is ours; and items marked final sale at checkout.' },
      { title: 'How do I start a return?', body: 'Message us on WhatsApp with your order number. In most cities we book a courier to collect from your address within two working days.' },
      { title: 'When am I refunded?', body: 'Five to seven working days to the original method for card and bank orders. COD orders are refunded by bank transfer, Easypaisa or JazzCash, whichever you prefer.' },
    ],
  },
  {
    title: 'Fabric & care',
    items: [
      { title: 'How should I wash lawn and khaddar?', body: 'Cold hand wash, separately for the first two or three washes. No bleach. Iron on the reverse while slightly damp, and dry in shade — direct sun is what fades a natural dye, not the washing.' },
      { title: 'Will the colour run?', body: 'Naturally dyed cloth in deep madder or indigo can release some colour in the first wash. That is normal and it settles. Wash it alone the first time and do not leave it soaking.' },
      { title: 'Is the print hand-blocked or machine-printed?', body: 'Both, depending on the article — and the product page says which. Hand block-printed cloth carries small irregularities in the repeat, which is the point of it rather than a fault.' },
      { title: 'Does the cloth shrink?', body: 'Cotton lawn can lose up to about 2% on a first hot wash, mostly in length. Have your tailor pre-wash unstitched cloth before cutting if you intend to wash it hot.' },
    ],
  },
  {
    title: 'Stitching',
    items: [
      { title: 'Does my order arrive stitched?', body: 'No — everything ships unstitched by default. You get measured lengths of cloth for your own tailor, and "Unstitched" is preselected on every product page.' },
      { title: 'Do you offer stitching?', body: 'Yes, as a paid add-on on any article. Pick a size instead of "Unstitched" on the product page, then take a standard size or send your own measurements — the Size Guide explains both.' },
      { title: 'How long does stitching add?', body: 'Five to nine working days before the parcel ships.' },
      { title: 'Can I ask for a specific cut?', body: 'Within reason — sleeve length, neckline depth, kameez length and trouser style are all fine. Anything more elaborate, message us first so we can check there is enough cloth in the article.' },
    ],
  },
  {
    title: 'About us',
    items: [
      { title: 'Do you weave or print your own cloth?', body: 'No, and we would rather say so plainly. Lyallpur Wear is a buying house: we source finished cloth from mills, block-printers and wholesalers in Faisalabad and sell it under our own name. We employ no weavers and own no looms, print tables or dye vats.' },
      { title: 'Then what do you actually do?', body: 'We choose. We spend our weeks in the cloth bazaars looking at far more cloth than we buy — roughly one bolt in nine comes back with us — then check, photograph, describe and pack it. The About page walks through all four steps.' },
      { title: 'Who makes the cloth, then?', body: 'Independent mills and weaving sheds across Faisalabad, and block-printing families in Multan. They are suppliers, not employees. Where they are happy to be named, we are working towards naming them on the product page.' },
      { title: 'Why "Lyallpur" and not "Faisalabad"?', body: 'Lyallpur is what the city was called before 1979, and the name still describes the trade that happens there. The City of Looms page has the full history.' },
      { title: 'Are you certified organic or fair-trade?', body: 'No. Certification covers a supply chain you control, and ours is a buying relationship. The Sustainability page sets out what we can and cannot promise from that position.' },
    ],
  },
];

export default function FAQ() {
  return (
    <div>
      <PageHero
        kicker="Questions"
        title="Asked and"
        accent="answered."
        lede="Everything we get asked most often, in one place. If your question isn't here, a real person in Faisalabad reads every message."
      />
      <section style={{ padding: 'var(--section-pad) var(--gutter)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {GROUPS.map((g, i) => (
            <Reveal key={g.title} style={{ marginBottom: i === GROUPS.length - 1 ? 0 : 64 }}>
              <div className="kicker kicker-gold" style={{ marginBottom: 20 }}>{g.title}</div>
              <Accordion items={g.items} openFirst={false} />
            </Reveal>
          ))}
          <Reveal>
            <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--line)', textAlign: 'center' }}>
              <h2 className="serif-display" style={{ fontSize: 'var(--display-sm)', marginBottom: 16 }}>
                Still <em style={{ color: 'var(--gold)', fontWeight: 300 }}>stuck?</em>
              </h2>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 480, margin: '0 auto 28px' }}>
                Message us on WhatsApp and we'll answer the same day.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link className="btn btn-gold" to="/contact">Contact us →</Link>
                <Link className="btn btn-outline" to="/shipping-returns">Shipping & returns</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <TrustStrip />
    </div>
  );
}
