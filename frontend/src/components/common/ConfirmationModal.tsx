'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    isDanger?: boolean;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    isDanger = false,
    isLoading = false
}: ConfirmationModalProps) {

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-200"
                onClick={isLoading ? undefined : onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    {message}
                </p>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={isDanger ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        disabled={isLoading}
                        isLoading={isLoading}
                        size="sm"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
