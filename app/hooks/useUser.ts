import { useRootData } from "./useRootData"

export const useUser = () => {
  const { user } = useRootData()

  return user
}
