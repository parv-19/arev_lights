export default function BlogContent({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="prose prose-invert max-w-none prose-p:text-muted prose-headings:text-neutral prose-strong:text-neutral prose-a:text-accent">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) return <h3 key={index}>{block.replace(/^### /, "")}</h3>;
        if (block.startsWith("## ")) return <h2 key={index}>{block.replace(/^## /, "")}</h2>;
        if (block.startsWith("# ")) return <h1 key={index}>{block.replace(/^# /, "")}</h1>;
        if (block.startsWith("- ")) {
          const items = block.split("\n").map((item) => item.replace(/^- /, "").trim()).filter(Boolean);
          return (
            <ul key={index}>
              {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          );
        }

        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
