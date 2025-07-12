import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    AtSign,
    Bold,
    Code,
    Image,
    Italic,
    Link,
    List,
    ListOrdered,
    Quote,
    Smile,
    Strikethrough
} from 'lucide-react';
import React, { useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  enableMentions?: boolean;
}

// Mock users for mentions
const mockUsers = [
  { id: '1', display: 'john_doe' },
  { id: '2', display: 'sarah_dev' },
  { id: '3', display: 'mike_smith' },
  { id: '4', display: 'anna_wilson' },
  { id: '5', display: 'tech_guru' },
  { id: '6', display: 'code_master' },
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "200px",
  enableMentions = true
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.setSelectionRange(start + before.length, end + before.length);
      textarea.focus();
    }, 0);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    insertText(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleMentionClick = () => {
    insertText('@');
  };

  const toolbarItems = [
    { icon: Bold, action: () => insertText('**', '**'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), tooltip: 'Italic' },
    { icon: Strikethrough, action: () => insertText('~~', '~~'), tooltip: 'Strikethrough' },
    { icon: Code, action: () => insertText('`', '`'), tooltip: 'Inline Code' },
    { icon: Quote, action: () => insertText('> '), tooltip: 'Quote' },
    { icon: List, action: () => insertText('- '), tooltip: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. '), tooltip: 'Numbered List' },
    { icon: Link, action: () => insertText('[', '](url)'), tooltip: 'Link' },
    { icon: Image, action: () => insertText('![alt text](', ')'), tooltip: 'Image' },
    { icon: AlignLeft, action: () => insertText('\n<div align="left">\n\n', '\n\n</div>\n'), tooltip: 'Align Left' },
    { icon: AlignCenter, action: () => insertText('\n<div align="center">\n\n', '\n\n</div>\n'), tooltip: 'Align Center' },
    { icon: AlignRight, action: () => insertText('\n<div align="right">\n\n', '\n\n</div>\n'), tooltip: 'Align Right' },
  ];

  const renderPreview = (text: string) => {
    // Enhanced markdown to HTML conversion with mention support
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^> (.+)/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.+)/gm, '<li>$1</li>')
      .replace(/^1\. (.+)/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      .replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>')
      .replace(/\n/g, '<br>');
  };

  const mentionStyle = {
    control: {
      backgroundColor: 'transparent',
      fontSize: 14,
      fontWeight: 'normal',
      border: 'none',
      outline: 'none',
      minHeight: minHeight,
    },
    input: {
      border: 'none',
      outline: 'none',
      padding: 0,
      margin: 0,
    },
    highlighter: {
      border: 'none',
      padding: 0,
      margin: 0,
    },
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: 14,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
      },
      item: {
        padding: '8px 12px',
        borderBottom: '1px solid #f1f5f9',
        '&focused': {
          backgroundColor: '#f8fafc',
        },
      },
    },
  };

  return (
    <div className="border border-border rounded-lg bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            {toolbarItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={item.action}
                    className="h-8 w-8 p-0"
                  >
                    <item.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            
            {/* Mention Button */}
            {enableMentions && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMentionClick}
                    className="h-8 w-8 p-0"
                  >
                    <AtSign className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mention User</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* Emoji Picker */}
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" side="bottom" align="start">
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  searchDisabled={false}
                  skinTonesDisabled={false}
                  width={350}
                  height={400}
                />
              </PopoverContent>
            </Popover>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isPreview ? "ghost" : "secondary"}
            size="sm"
            onClick={() => setIsPreview(false)}
          >
            Write
          </Button>
          <Button
            variant={isPreview ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(true)}
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3">
        {isPreview ? (
          <div 
            className="prose prose-sm max-w-none min-h-[200px] p-3 rounded border border-dashed border-border"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ 
              __html: value ? renderPreview(value) : '<p class="text-muted-foreground italic">Nothing to preview</p>' 
            }}
          />
        ) : (
          enableMentions ? (
            <MentionsInput
              value={value}
              onChange={(event) => onChange(event.target.value)}
              style={mentionStyle}
              placeholder={placeholder}
              className="min-h-[200px] w-full resize-none focus:outline-none"
            >
              <Mention
                trigger="@"
                data={mockUsers}
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontWeight: '500',
                  padding: '2px 4px',
                  borderRadius: '4px',
                }}
                renderSuggestion={(suggestion, search, highlightedDisplay) => (
                  <div className="flex items-center space-x-2 p-2">
                    <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {suggestion.display.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{highlightedDisplay}</span>
                  </div>
                )}
              />
            </MentionsInput>
          ) : (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[200px] border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              style={{ minHeight }}
            />
          )
        )}
      </div>

      {/* Footer */}
      <div className="p-3 pt-0 text-xs text-muted-foreground">
        <p>
          Supports <strong>Markdown</strong> formatting. Use **bold**, *italic*, `code`, emojis{enableMentions && ', @mentions'}, and more.
        </p>
      </div>
    </div>
  );
};