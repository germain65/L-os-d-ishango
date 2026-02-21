'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface KatexRendererProps {
  expression: string;
  displayMode?: 'inline' | 'display';
  className?: string;
}

export default function KatexRenderer(props: KatexRendererProps) {
  const { expression, displayMode = 'inline', className = '' } = props;

  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(expression, {
        displayMode: displayMode === 'display',
        throwOnError: false,
        strict: false,
        trust: true,
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\ZZ": "\\mathbb{Z}",
          "\\QQ": "\\mathbb{Q}",
        },
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return `<span class="text-red-500">Erreur de rendu mathématique</span>`;
    }
  }, [expression, displayMode]);

  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
