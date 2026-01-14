import { useCallback, useEffect, useState } from "react";
import mermaid from "mermaid";
import { MERMAID_CONFIG, MERMAID_ID_PREFIX } from "../mermaid-view/constants";

interface UseMermaidRendererProps {
  code: string;
  theme: string;
}

interface MermaidRendererReturn {
  svg: string;
  error: string;
  renderMermaid: () => Promise<void>;
}

export const useMermaidRenderer = ({
  code,
  theme,
}: UseMermaidRendererProps): MermaidRendererReturn => {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  const renderMermaid = useCallback(async () => {
    const pureCode = code.trim();
    if (!pureCode) {
      setSvg("");
      setError("");
      return;
    }

    try {
      const mermaidTheme =
        theme === "dark" ? MERMAID_CONFIG.darkTheme : MERMAID_CONFIG.lightTheme;
      mermaid.initialize({
        startOnLoad: MERMAID_CONFIG.startOnLoad,
        theme: mermaidTheme,
        securityLevel: MERMAID_CONFIG.securityLevel,
      });

      const id = `${MERMAID_ID_PREFIX}${Date.now()}`;
      const { svg: renderedSvg } = await mermaid.render(id, pureCode);

      setSvg(renderedSvg);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid mermaid syntax");
      setSvg("");
    }
  }, [code, theme]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  return { svg, error, renderMermaid };
};
