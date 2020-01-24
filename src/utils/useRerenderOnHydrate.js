import { useState, useEffect } from 'react'

const useRerenderOnHydrate = () => {
  const [win, setWin] = useState()
  useEffect(() => {
    setWin(() => typeof window !== 'undefined')
  }, [])
  return win
}

export default useRerenderOnHydrate
