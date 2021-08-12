import { useCallback, useEffect, useState } from "react";
import marked from "marked";
import markdownReadme from "./assets/guide.md";
import "./App.scss";

function App() {
    const [markdown, setMarkdown] = useState(null);

    const loadMarkdown = useCallback(async () => {
        const markdownText = await (await fetch(markdownReadme)).text();
        setMarkdown(marked(markdownText));
    }, []);

    useEffect(() => loadMarkdown(), [loadMarkdown]);

    return <div dangerouslySetInnerHTML={{ __html: markdown }} />;
}

export default App;
