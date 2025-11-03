// Adapted from https://ui.shadcn.com/docs/components/toast
import { useToast as useToastOriginal } from "@/components/ui/toast"

export const useToast = () => {
  const { toast } = useToastOriginal()
  
  return {
    toast: (props) => {
      const { title, description, variant = "default", ...rest } = props
      
      return toast({
        title,
        description,
        variant,
        ...rest,
      })
    }
  }
}