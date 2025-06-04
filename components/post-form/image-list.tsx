import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoImageSelected from "./no-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft, MenuIcon } from "lucide-react";
import { boolean } from "zod";
import { useState } from "react";

export default function ImageList({ imagesFiles }: { imagesFiles: File[] }) {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    else return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDialogOpen = () => {
    setDialogOpen((oldValue: boolean) => !oldValue);
    document.body.style.pointerEvents = "auto";
  };
  return (
    <>
      {" "}
      {imagesFiles.length === 0 ? (
        <NoImageSelected />
      ) : (
        <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
          <Table className="overflow-x-hidden">
            <TableHeader className="overflow-x-hidden">
              <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0 ">
                <TableHead className="w-[100px] ">Visualização</TableHead>
                <TableHead className="w-[100px]  text-start">Tamanho</TableHead>
                <TableHead className="w-[100px]  text-start">Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="right-0 text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
              {imagesFiles.map((image, index) => {
                const url =
                  image instanceof Blob
                    ? URL.createObjectURL(image)
                    : "invalid-file";

                return (
                  <TableRow
                    key={index}
                    className="odd:bg-muted/50 [&>*]:whitespace-nowrap"
                  >
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                      <DialogContent showCloseButton={false}>
                        <DialogHeader>
                          <Button
                            size={"icon"}
                            variant={"secondary"}
                            onClick={handleDialogOpen}
                          >
                            <ArrowLeft />
                          </Button>
                          <DialogTitle>{image.name}</DialogTitle>
                          <DialogDescription>{image.type}</DialogDescription>
                        </DialogHeader>
                        <Image
                          src={url}
                          className="aspect-auto object-cover"
                          width={2000}
                          height={2000}
                          alt="image from image list form"
                        />
                      </DialogContent>
                    </Dialog>
                    <TableCell className="flex items-center justify-center">
                      <Image
                        src={url}
                        className="aspect-auto object-cover"
                        width={70}
                        height={10}
                        alt="image from image list form"
                      />
                    </TableCell>
                    <TableCell>{formatFileSize(image.size)} </TableCell>
                    <TableCell className="font-medium  w-[100px] ">
                      {image.name}
                    </TableCell>
                    <TableCell>{image.type}</TableCell>
                    <TableCell className="right-0 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size={"icon"} variant={"secondary"}>
                            <MenuIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Billing</DropdownMenuItem>
                          <DropdownMenuItem>Team</DropdownMenuItem>
                          <DropdownMenuItem onClick={handleDialogOpen}>
                            Ver imagem
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">
                            Deletar imagem
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
