import React, { useEffect } from 'react'
import uuidv4 from "../../utils/uuidv4";

export default function Iframe({ src, ...props }) {
  const iframeId = uuidv4().toString();

  useEffect(() => {
    const iframe = document.getElementById(iframeId)
    if (iframe) {
      iframe.src = src
    }
  }, [iframeId, src])

  if (!src) {
    return 'please specify a src'
  }



  return (
    <>
      <iframe
        id={iframeId}
        {...props}
      />
    </>
  )
}
