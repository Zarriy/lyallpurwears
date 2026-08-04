// Small round swatch used as the `preview.media` for the colour document type,
// so editors can see the actual colour next to its name/hex in list views.
export function ColourSwatch({ hex }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: hex || '#eee',
        border: '1px solid rgba(0,0,0,0.15)',
      }}
    />
  );
}
