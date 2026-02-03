'use client';

import * as React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface TruncatedTextProps {
    text: string;
    maxLength?: number;
    className?: string;
    as?: any;
}

export default function TruncatedText({ text, maxLength = 30, className = '', as: Component = 'span' }: TruncatedTextProps) {
    const isTruncated = text.length > maxLength;
    const displayText = isTruncated ? `${text.slice(0, maxLength).trim()}…` : text;

    if (!isTruncated) {
        return <Component className={className}>{text}</Component>;
    }

    return (
        <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Component className={`${className} cursor-help`}>
                        {displayText}
                    </Component>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md shadow-lg z-50 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                        sideOffset={5}
                    >
                        {text}
                        <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
