import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/hooks";
import { Copy } from "lucide-react";

interface Props {
  id: string;
}

export default function UserId({ id }: Props) {
  const copyToClipboard = useCopyToClipboard();

  const handleClick = async () => {
    copyToClipboard(id);
  };

  return (
    <Button
      onClick={handleClick}
      aria-label="Copy user ID to clipboard"
      variant="outline"
      size={"icon"}
    >
      <Copy />
    </Button>
  );
}
