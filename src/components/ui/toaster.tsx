"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useState, useRef } from "react";

export function Toaster() {
  const { toasts } = useToast()
  const [renderedToasts, setRenderedToasts] = useState([...toasts]);
  const previousToastsRef = useRef<typeof toasts>(toasts);

  useEffect(() => {
    // Check if the toasts array identity has changed
    if (previousToastsRef.current !== toasts) {
      setRenderedToasts([...toasts]);
      previousToastsRef.current = toasts;
    }
  }, [toasts]);


  return (
    <ToastProvider>
      {renderedToasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

