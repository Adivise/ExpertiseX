import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
    return (
        <div className="markdown-content">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;