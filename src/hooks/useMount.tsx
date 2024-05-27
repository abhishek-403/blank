import React, { useEffect, useState } from "react";


export default function useMount() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}
