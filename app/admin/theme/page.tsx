"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Palette, Save } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ThemeSettingsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Theme colors state
  const [colors, setColors] = useState({
    primary: "#7b0046", // Maroon/purple from logo
    secondary: "#1e3a8a", // Dark blue from logo ribbon
    accent: "#00a4c9", // Teal/blue from mountain
    gold: "#c9a536", // Gold border
    green: "#4caf50", // Green from mountain base
  })

  // Logo settings
  const [logoSettings, setLogoSettings] = useState({
    showLogo: true,
    logoSize: "medium",
    logoPosition: "left",
  })

  // Typography settings
  const [typography, setTypography] = useState({
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: "medium",
  })

  const handleColorChange = (colorName: string, value: string) => {
    setColors({
      ...colors,
      [colorName]: value,
    })
  }

  const handleSaveTheme = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Success",
        description: "Theme settings have been saved successfully",
      })
    }, 1500)
  }

  const handleResetTheme = () => {
    setColors({
      primary: "#7b0046", // Maroon/purple from logo
      secondary: "#1e3a8a", // Dark blue from logo ribbon
      accent: "#00a4c9", // Teal/blue from mountain
      gold: "#c9a536", // Gold border
      green: "#4caf50", // Green from mountain base
    })

    setLogoSettings({
      showLogo: true,
      logoSize: "medium",
      logoPosition: "left",
    })

    setTypography({
      headingFont: "Inter",
      bodyFont: "Inter",
      fontSize: "medium",
    })

    toast({
      title: "Reset Complete",
      description: "Theme settings have been reset to defaults",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Theme Settings</h1>
            <p className="text-muted-foreground">Customize the appearance of the helpdesk system</p>
          </div>
          <Button onClick={handleSaveTheme} disabled={isSubmitting} className="bg-kemu-maroon hover:bg-kemu-maroon/90">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="colors">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="logo">Logo & Branding</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Palette className="h-5 w-5" />
                  Color Scheme
                </CardTitle>
                <CardDescription>Customize the color scheme of the helpdesk system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="text-black font-medium">
                      Primary Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="text"
                        value={colors.primary}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                      />
                      <Input
                        type="color"
                        value={colors.primary}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                    <div className="h-10 rounded-md" style={{ backgroundColor: colors.primary }}></div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="text-black font-medium">
                      Secondary Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="text"
                        value={colors.secondary}
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                      />
                      <Input
                        type="color"
                        value={colors.secondary}
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                    <div className="h-10 rounded-md" style={{ backgroundColor: colors.secondary }}></div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor" className="text-black font-medium">
                      Accent Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="text"
                        value={colors.accent}
                        onChange={(e) => handleColorChange("accent", e.target.value)}
                      />
                      <Input
                        type="color"
                        value={colors.accent}
                        onChange={(e) => handleColorChange("accent", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                    <div className="h-10 rounded-md" style={{ backgroundColor: colors.accent }}></div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goldColor" className="text-black font-medium">
                      Gold Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="goldColor"
                        type="text"
                        value={colors.gold}
                        onChange={(e) => handleColorChange("gold", e.target.value)}
                      />
                      <Input
                        type="color"
                        value={colors.gold}
                        onChange={(e) => handleColorChange("gold", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                    <div className="h-10 rounded-md" style={{ backgroundColor: colors.gold }}></div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="greenColor" className="text-black font-medium">
                      Green Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="greenColor"
                        type="text"
                        value={colors.green}
                        onChange={(e) => handleColorChange("green", e.target.value)}
                      />
                      <Input
                        type="color"
                        value={colors.green}
                        onChange={(e) => handleColorChange("green", e.target.value)}
                        className="w-12 p-1 h-10"
                      />
                    </div>
                    <div className="h-10 rounded-md" style={{ backgroundColor: colors.green }}></div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 text-black">Preview</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-md text-white" style={{ backgroundColor: colors.primary }}>
                      Primary Color
                    </div>
                    <div className="p-4 rounded-md text-white" style={{ backgroundColor: colors.secondary }}>
                      Secondary Color
                    </div>
                    <div className="p-4 rounded-md text-white" style={{ backgroundColor: colors.accent }}>
                      Accent Color
                    </div>
                    <div className="p-4 rounded-md" style={{ backgroundColor: colors.gold, color: "#000" }}>
                      Gold Color
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetTheme}>
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleSaveTheme}
                  disabled={isSubmitting}
                  className="bg-kemu-maroon hover:bg-kemu-maroon/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="logo">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Branding</CardTitle>
                <CardDescription>Customize the logo and branding elements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Logo Preview</Label>
                    <div className="flex justify-center p-6 border rounded-md">
                      <div className="relative w-40 h-40">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ke-MU-Brand-Logo-1.jpg-Uxw8eB1OlYPQCH09ldbKc122s2LpzS.jpeg"
                          alt="Kenya Methodist University Logo"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="logoSize">Logo Size</Label>
                      <select
                        id="logoSize"
                        className="w-full p-2 border rounded-md"
                        value={logoSettings.logoSize}
                        onChange={(e) => setLogoSettings({ ...logoSettings, logoSize: e.target.value })}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoPosition">Logo Position</Label>
                      <select
                        id="logoPosition"
                        className="w-full p-2 border rounded-md"
                        value={logoSettings.logoPosition}
                        onChange={(e) => setLogoSettings({ ...logoSettings, logoPosition: e.target.value })}
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showLogo"
                        checked={logoSettings.showLogo}
                        onChange={(e) => setLogoSettings({ ...logoSettings, showLogo: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="showLogo">Show Logo in Header</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetTheme}>
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleSaveTheme}
                  disabled={isSubmitting}
                  className="bg-kemu-maroon hover:bg-kemu-maroon/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Customize fonts and text styles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Heading Font</Label>
                    <select
                      id="headingFont"
                      className="w-full p-2 border rounded-md"
                      value={typography.headingFont}
                      onChange={(e) => setTypography({ ...typography, headingFont: e.target.value })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyFont">Body Font</Label>
                    <select
                      id="bodyFont"
                      className="w-full p-2 border rounded-md"
                      value={typography.bodyFont}
                      onChange={(e) => setTypography({ ...typography, bodyFont: e.target.value })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Base Font Size</Label>
                    <select
                      id="fontSize"
                      className="w-full p-2 border rounded-md"
                      value={typography.fontSize}
                      onChange={(e) => setTypography({ ...typography, fontSize: e.target.value })}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium">Typography Preview</h3>
                  <div className="space-y-4 p-4 border rounded-md">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: typography.headingFont }}>
                      Heading 1 - {typography.headingFont}
                    </h1>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: typography.headingFont }}>
                      Heading 2 - {typography.headingFont}
                    </h2>
                    <h3 className="text-xl font-bold" style={{ fontFamily: typography.headingFont }}>
                      Heading 3 - {typography.headingFont}
                    </h3>
                    <p style={{ fontFamily: typography.bodyFont }}>
                      Body text using {typography.bodyFont}. This is how paragraphs will appear throughout the
                      application. The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleResetTheme}>
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleSaveTheme}
                  disabled={isSubmitting}
                  className="bg-kemu-maroon hover:bg-kemu-maroon/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

