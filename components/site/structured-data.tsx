export function StructuredData({
  items,
}: {
  items: Array<Record<string, unknown>>;
}) {
  return (
    <>
      {items.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
          key={index}
          type="application/ld+json"
        />
      ))}
    </>
  );
}
