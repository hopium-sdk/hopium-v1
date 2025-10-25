"use client";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/main/shadcn/components/ui/dialog";
import { ButtonDiv } from "@/main/components/ui/button-div";
import { cn } from "@/main/shadcn/lib/utils";
import { buttonVariants } from "@/main/shadcn/components/ui/button";
import { VariantProps } from "class-variance-authority";

type T_Modal = {
  children: React.ReactNode;
  modalOpen?: boolean;
  setModalOpen?: (open: boolean) => void;
  title: string;
  description?: string;
  buttonText?: string;
  buttonVariant?: "button" | "link";
  buttonVariantOption?: VariantProps<typeof buttonVariants>["variant"];
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
  bodyClassName?: string;
  triggerClassName?: string;
  triggerPClassName?: string;
  buttonIcon?: React.ReactNode;
  modalIcon?: React.ReactNode;
  onClick?: () => void;
  buttonVisible?: boolean;
};

export const Modal = ({
  children,
  modalOpen,
  setModalOpen,
  title,
  description,
  buttonText,
  buttonVariant,
  buttonVariantOption,
  buttonSize,
  className,
  bodyClassName,
  triggerClassName,
  triggerPClassName,
  buttonIcon,
  modalIcon,
  onClick,
  buttonVisible = true,
}: T_Modal) => {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {buttonVisible && (
        <DialogTrigger onClick={onClick} className="w-fit">
          {buttonVariant == "button" ? (
            <ButtonDiv
              variant={buttonVariantOption ? buttonVariantOption : "default"}
              size={buttonSize ? buttonSize : "default"}
              className={cn(triggerClassName ? triggerClassName : "")}
            >
              {buttonIcon && buttonIcon}
              <p className={cn("text-sm", triggerPClassName ? triggerPClassName : "")}>{buttonText}</p>
            </ButtonDiv>
          ) : (
            <div className={cn("flex items-center gap-2", triggerClassName ? triggerClassName : "")}>
              <p className={cn("text-sm hover:underline cursor-pointer", triggerPClassName ? triggerPClassName : "")}>{buttonText}</p>
            </div>
          )}
        </DialogTrigger>
      )}
      <DialogContent className={cn("bg-bg", className ? className : "")}>
        <DialogHeader className="border-b-2 pb-4">
          <DialogTitle className="flex items-center gap-2">
            {modalIcon && modalIcon}
            {title}
          </DialogTitle>
          {description && <DialogDescription className="text-sm text-subtext font-medium">{description}</DialogDescription>}
        </DialogHeader>
        <DialogBody className={bodyClassName ? bodyClassName : ""}>{children}</DialogBody>
      </DialogContent>
    </Dialog>
  );
};
