import React, { useState, useEffect } from 'react';
import { Copy, MessageSquare } from 'lucide-react';

const WhatsAppFormatter = () => {
    let [inputText, setInputText] = useState('');
    const [formattedText, setFormattedText] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const formatText = (text) => {
        let result = text;

        // Bold: *text* -> *text*
        result = result.replace(/\*([^*]+)\*/g, '*$1*');

        // Italic: _text_ -> _text_
        result = result.replace(/(?<!\*)_([^_]+)_(?!\*)/g, '_$1_');

        // Strikethrough: ~text~ -> ~text~
        result = result.replace(/~([^~]+)~/g, '~$1~');

        // Monospace: `text` -> ```text```
        result = result.replace(/`([^`]+)`/g, '```$1```');

        // Spoiler: ||text|| -> custom format
        result = result.replace(/\|\|([^|]+)\|\|/g, ` $1 `);

        return result;
    };

    useEffect(() => {
        setFormattedText(formatText(inputText));
    }, [inputText]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(formattedText);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = formattedText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const applyFormat = (format) => {
        if (!inputText.trim()) return;

        let formatChars = '';
        switch (format) {
            case 'bold': formatChars = '*'; break;
            case 'italic': formatChars = '_'; break;
            case 'strike': formatChars = '~'; break;
            case 'mono': formatChars = '`'; break;
            case 'spoiler':
                formatChars = '[SPOILER]';
                inputText = '​'.repeat(4000) + inputText
            break;
        }

        // Apply formatting to entire text
        const newText = formatChars + inputText + formatChars;
        setInputText(newText);

        // Focus back to textarea
        setTimeout(() => {
            document.getElementById('inputText').focus();
        }, 0);
    };

    const presetMessages = [
        "The movie ending: ||The butler did it||",
        "Game spoiler: ||The princess is in another castle||",
        "News: ||Election results will be announced tomorrow||"
    ];

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                        <MessageSquare size={20} />
                    </div>
                    <h1 className="text-lg font-bold tracking-wide">WA Formatter</h1>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Input Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Type your message:
                    </label>
                    <div className="relative">
                        <textarea
                            id="inputText"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type here... Use ||text|| for spoilers, *bold*, _italic_, ~strike~, `mono`"
                            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-inner placeholder-gray-400"
                        />
                        <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                            {inputText.length}/1000
                        </div>
                    </div>
                </div>

                {/* Formatting Buttons */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Quick Format
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                        <button
                            onClick={() => applyFormat('spoiler')}
                            className="p-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 border-2 border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 flex items-center justify-center text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                            title="Make entire text spoiler"
                            disabled={!inputText.trim()}
                        >
                            || 🔒️ ||
                        </button>
                        <button
                            onClick={() => applyFormat('bold')}
                            className="p-3 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl font-bold transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                            title="Make entire text bold"
                            disabled={!inputText.trim()}
                        >
                            *B*
                        </button>
                        <button
                            onClick={() => applyFormat('italic')}
                            className="p-3 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl italic transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                            title="Make entire text italic"
                            disabled={!inputText.trim()}
                        >
                            _I_
                        </button>
                        <button
                            onClick={() => applyFormat('strike')}
                            className="p-3 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl line-through transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                            title="Make entire text strikethrough"
                            disabled={!inputText.trim()}
                        >
                            ~S~
                        </button>
                        <button
                            onClick={() => applyFormat('mono')}
                            className="p-3 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl font-mono text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                            title="Make entire text monospace"
                            disabled={!inputText.trim()}
                        >
                            `M`
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Formatted for WhatsApp:
                    </label>
                    <div className="min-h-20 p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl whitespace-pre-wrap shadow-inner font-mono text-sm">
                        {formattedText || (
                            <span className="text-gray-400 italic">Your formatted text will appear here...</span>
                        )}
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    onClick={copyToClipboard}
                    disabled={!formattedText}
                    className={`w-full p-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 transform ${
                        formattedText
                            ? copySuccess
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-105 shadow-lg'
                                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <Copy size={18} />
                    {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                </button>

                {/* Quick Examples */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Quick Examples:
                    </h3>
                    <div className="space-y-2">
                        {presetMessages.map((msg, index) => (
                            <button
                                key={index}
                                onClick={() => setInputText(msg)}
                                className="w-full p-3 text-left bg-white/80 hover:bg-white border-2 border-blue-100 hover:border-blue-200 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                            >
                                <span className="text-blue-600 font-medium">Example {index + 1}:</span>
                                <br />
                                <span className="text-gray-600">{msg}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Usage Guide */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200 shadow-inner">
                    <h4 className="font-semibold text-sm mb-3 text-blue-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        How to Use:
                    </h4>
                    <div className="text-xs text-blue-700 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                            Type your message in the text box
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                            Click a formatting button to apply style to entire text
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                            Copy the formatted result to WhatsApp
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-200 shadow-inner">
                    <h4 className="font-semibold text-sm mb-3 text-yellow-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        WhatsApp Result:
                    </h4>
                    <div className="text-xs text-yellow-700 space-y-2">
                        <div className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                            <span className="font-mono">*bold text*</span>
                            <span>→</span>
                            <strong>Bold in WhatsApp</strong>
                        </div>
                        <div className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                            <span className="font-mono">_italic text_</span>
                            <span>→</span>
                            <em>Italic in WhatsApp</em>
                        </div>
                        <div className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                            <span className="font-mono">~strike text~</span>
                            <span>→</span>
                            <s>Strikethrough in WhatsApp</s>
                        </div>
                        <div className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                            <span className="font-mono">`mono text`</span>
                            <span>→</span>
                            <span className="font-mono bg-gray-200 px-1 rounded">Monospace in WhatsApp</span>
                        </div>
                        <div className="flex items-center justify-between bg-white/50 p-2 rounded-lg">
                            <span className="font-mono">||spoiler||</span>
                            <span>→</span>
                            <span className="bg-red-100 px-2 py-1 rounded">[SPOILER] ...Read more</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppFormatter;