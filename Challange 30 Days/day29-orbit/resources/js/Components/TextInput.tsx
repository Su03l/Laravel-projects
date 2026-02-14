import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useRef,
} from 'react';

export default forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean }>(
    function TextInput(
        {
            type = 'text',
            className = '',
            isFocused = false,
            ...props
        },
        ref,
    ) {
        const localRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (isFocused) {
                localRef.current?.focus();
            }
        }, [isFocused]);

        return (
            <input
                {...props}
                type={type}
                className={
                    'rounded-xl border-white/[0.08] bg-white/[0.04] shadow-sm focus:border-indigo-500/50 focus:ring-indigo-500/30 text-zinc-200 placeholder:text-zinc-600 transition-colors ' +
                    className
                }
                ref={(node) => {
                    (localRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                    }
                }}
            />
        );
    }
);
