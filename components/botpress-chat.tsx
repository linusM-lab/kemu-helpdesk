"use client"

import { useEffect } from "react"

export function BotpressChat() {
  useEffect(() => {
    // Load the Botpress scripts
    const injectScript = document.createElement("script")
    injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js"
    injectScript.async = true
    document.body.appendChild(injectScript)

    const botpressScript = document.createElement("script")
    botpressScript.src = "https://files.bpcontent.cloud/2025/03/13/14/20250313140412-9V1G9V8B.js"
    botpressScript.async = true
    document.body.appendChild(botpressScript)

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(injectScript)
      document.body.removeChild(botpressScript)
    }
  }, [])

  return null // This component doesn't render anything visible
}

