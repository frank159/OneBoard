"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // evita erro de hidratação

  return (
    <div className="p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-x-4">
            <Button onClick={() => setTheme("light")} variant={theme === "light" ? "default" : "outline"}>
              Tema Claro
            </Button>
            <Button onClick={() => setTheme("dark")} variant={theme === "dark" ? "default" : "outline"}>
              Tema Escuro
            </Button>
            <Button onClick={() => setTheme("system")} variant={theme === "system" ? "default" : "outline"}>
              Tema do Sistema
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
