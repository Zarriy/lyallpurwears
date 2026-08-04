import { ColourSwatch } from '../components/ColourSwatch.jsx';

export default {
  name: 'colour',
  title: 'Colour',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Ivory Rose", "Sage", "Saffron", "Charcoal".',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'hex',
      title: 'Hex value',
      type: 'string',
      description: 'A 6-digit hex colour, e.g. #F0E0D8.',
      validation: (Rule) =>
        Rule.required()
          .regex(/^#[0-9a-fA-F]{6}$/, { name: 'hex colour' })
          .error('Must be a #rrggbb hex value, e.g. #F0E0D8'),
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'hex', hex: 'hex' },
    prepare({ title, subtitle, hex }) {
      return {
        title,
        subtitle,
        media: <ColourSwatch hex={hex} />,
      };
    },
  },
};
