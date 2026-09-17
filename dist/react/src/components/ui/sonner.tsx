import { useTheme } from "next-themes"
import { Icon } from './icon'
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Icon name="checkCircle" className="size-4" />,
        info: <Icon name="info" className="size-4" />,
        warning: <Icon name="warning" className="size-4" />,
        error: <Icon name="cancel" className="size-4" />,
        loading: <Icon name="refresh" className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
