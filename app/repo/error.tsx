"use client"; 
import { useEffect } from "react";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    
    console.error(error);
  }, [error]);

  return (
    <div className="p-10">
      <h2 className="text-lg">Something went wrong!</h2>
      <h4>{error.message}</h4>   
      <button
        onClick={
          
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
