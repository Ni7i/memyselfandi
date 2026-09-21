/**
 * Renders post text: paragraphs separated by blank lines, `**bold**` inline,
 * and a paragraph that is entirely `**…**` as a subheading.
 */
export default function PostContent({ content }: { content: string }) {
  return (
    <>
      {content.split("\n\n").map((paragraph, index) => {
        if (/^\*\*[^*]+\*\*$/.test(paragraph.trim())) {
          return <h2 key={index}>{paragraph.trim().slice(2, -2)}</h2>;
        }
        return (
          <p key={index}>
            {paragraph.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
              part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
                <strong key={partIndex}>{part.slice(2, -2)}</strong>
              ) : (
                part
              ),
            )}
          </p>
        );
      })}
    </>
  );
}
