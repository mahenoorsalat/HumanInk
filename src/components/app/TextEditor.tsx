import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  readOnly?: boolean;
  showActions?: boolean;
}

const TextEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  readOnly = false,
  showActions = true 
}: TextEditorProps) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  const handleClear = () => {
    onChange("");
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanink-output.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Text saved as file.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {showActions && value && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            {!readOnly && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {readOnly && (
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <Textarea
        variant="editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="flex-1 min-h-[300px]"
      />
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground font-mono">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
};

export default TextEditor;
