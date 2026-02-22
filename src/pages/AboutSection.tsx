import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = { content: string };

export function AboutSection({ content }: Props) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
