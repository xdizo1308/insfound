"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Settings,
  Menu,
  X,
  PanelLeft,
  Bell,
  Copy,
  Globe,
  Bookmark,
  Sparkles,
  Send,
  Trash2,
  Heart,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const mockInspirationResults = [
  {
    id: 1,
    title: "Minimalist SaaS Landing",
    description: "Clean, modern SaaS product landing page",
    thumbnail: "/minimalist-saas-landing-page.jpg",
    category: "Landing Page",
  },
  {
    id: 2,
    title: "Bold Typography Hero",
    description: "Large, impactful typography-focused design",
    thumbnail: "/bold-typography-hero-section.jpg",
    category: "Hero Section",
  },
  {
    id: 3,
    title: "Elegant Portfolio",
    description: "Sophisticated portfolio showcase design",
    thumbnail: "/elegant-portfolio-website.jpg",
    category: "Portfolio",
  },
  {
    id: 4,
    title: "Modern E-commerce",
    description: "Contemporary e-commerce product page",
    thumbnail: "/modern-ecommerce-design.jpg",
    category: "E-commerce",
  },
]

const mockSiteInspirations = [
  {
    id: 1,
    title: "Stripe",
    url: "stripe.com",
    thumbnail: "/stripe-website-design.jpg",
    category: "SaaS",
  },
  {
    id: 2,
    title: "Apple",
    url: "apple.com",
    thumbnail: "/apple-website-design.jpg",
    category: "Tech",
  },
  {
    id: 3,
    title: "Airbnb",
    url: "airbnb.com",
    thumbnail: "/airbnb-website-design.jpg",
    category: "Marketplace",
  },
  {
    id: 4,
    title: "Figma",
    url: "figma.com",
    thumbnail: "/figma-website-design.jpg",
    category: "Design Tool",
  },
]

const sidebarItems = [
  {
    title: "Home",
    icon: <Home className="w-5 h-5" />,
    id: "home",
  },
  {
    title: "Find with Copy",
    icon: <Copy className="w-5 h-5" />,
    id: "copy",
  },
  {
    title: "Find by Site",
    icon: <Globe className="w-5 h-5" />,
    id: "site",
  },
  {
    title: "Saved Inspirations",
    icon: <Bookmark className="w-5 h-5" />,
    id: "saved",
  },
  {
    title: "Generate Layout",
    icon: <Sparkles className="w-5 h-5" />,
    id: "generate",
  },
]

interface InspirationItem {
  id: number | string
  title: string
  description?: string
  url?: string
  thumbnail: string
  category: string
}

export function Insfound() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [copyInput, setCopyInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [showCopyResults, setShowCopyResults] = useState(false)
  const [showSiteResults, setShowSiteResults] = useState(false)

  const [copyLoading, setCopyLoading] = useState(false)
  const [copyError, setCopyError] = useState("")
  const [siteLoading, setSiteLoading] = useState(false)
  const [siteError, setSiteError] = useState("")
  const [copyResults, setCopyResults] = useState<InspirationItem[]>([])
  const [siteResults, setSiteResults] = useState<InspirationItem[]>([])

  const [savedInspirations, setSavedInspirations] = useState<InspirationItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("insfound_saved")
    if (saved) {
      try {
        setSavedInspirations(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load saved inspirations", e)
      }
    }
  }, [])

  const saveInspiration = (item: InspirationItem) => {
    if (!isSaved(item.id)) {
      const updated = [...savedInspirations, item]
      setSavedInspirations(updated)
      localStorage.setItem("insfound_saved", JSON.stringify(updated))
    }
  }

  const removeInspiration = (id: number | string) => {
    const updated = savedInspirations.filter((item) => item.id !== id)
    setSavedInspirations(updated)
    localStorage.setItem("insfound_saved", JSON.stringify(updated))
  }

  const isSaved = (id: number | string) => {
    return savedInspirations.some((item) => item.id === id)
  }

  const handleCopySearch = async () => {
    if (!copyInput.trim()) {
      setCopyError("Please enter some copy to search")
      return
    }

    setCopyLoading(true)
    setCopyError("")
    setCopyResults([])

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock results based on input
      const results = mockInspirationResults.map((item, idx) => ({
        ...item,
        id: `copy-${idx}`,
      }))

      setCopyResults(results)
      setShowCopyResults(true)
    } catch (error) {
      setCopyError("Failed to search. Please try again.")
      console.error("Search error:", error)
    } finally {
      setCopyLoading(false)
    }
  }

  const handleSiteSearch = async () => {
    if (!urlInput.trim()) {
      setSiteError("Please enter at least one URL")
      return
    }

    setSiteLoading(true)
    setSiteError("")
    setSiteResults([])

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock results based on input
      const results = mockSiteInspirations.map((item, idx) => ({
        ...item,
        id: `site-${idx}`,
      }))

      setSiteResults(results)
      setShowSiteResults(true)
    } catch (error) {
      setSiteError("Failed to analyze sites. Please try again.")
      console.error("Search error:", error)
    } finally {
      setSiteLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white text-black">
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-black/10 transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-6 border-b border-black/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Insfound</h2>
                <p className="text-xs text-black/60">Inspiration Finder</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    activeTab === item.id ? "bg-black text-white" : "text-black hover:bg-black/5",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-black/10 p-4">
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r border-black/10 bg-white transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-6 border-b border-black/10">
            <h2 className="text-xl font-bold tracking-tight">Insfound</h2>
            <p className="text-xs text-black/60">Inspiration Finder</p>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    activeTab === item.id ? "bg-black text-white" : "text-black hover:bg-black/5",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-black/10 p-4">
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-black/10 bg-white/95 backdrop-blur px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">Insfound</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-lg">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8 border border-black/20">
                <AvatarImage src="/user-avatar.jpg" alt="User" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "home" && (
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl border border-black/10 bg-black p-8 text-white text-center"
                  >
                    <h2 className="text-4xl font-bold mb-3">Find website inspiration effortlessly.</h2>
                    <p className="text-white/70 max-w-2xl mx-auto">
                      Paste your copy or give us a site you love — we'll do the rest.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl border border-black/10 p-8 hover:border-black/30 transition-all cursor-pointer"
                      onClick={() => setActiveTab("copy")}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white">
                          <Copy className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold">Find with Copy</h3>
                      </div>
                      <p className="text-black/60 mb-4">
                        Paste your marketing copy, headline, or tagline to discover similar design inspirations.
                      </p>
                      <Button className="rounded-lg bg-black text-white hover:bg-black/90">Get Started</Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl border border-black/10 p-8 hover:border-black/30 transition-all cursor-pointer"
                      onClick={() => setActiveTab("site")}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white">
                          <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold">Find by Site</h3>
                      </div>
                      <p className="text-black/60 mb-4">
                        Share websites you love and find similar designs that match their aesthetic.
                      </p>
                      <Button className="rounded-lg bg-black text-white hover:bg-black/90">Get Started</Button>
                    </motion.div>
                  </div>
                </div>
              )}

              {activeTab === "copy" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Find with Copy</h2>
                    <p className="text-black/60">Paste your marketing copy to discover design inspirations</p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium">Your Copy</label>
                    <textarea
                      value={copyInput}
                      onChange={(e) => {
                        setCopyInput(e.target.value)
                        setCopyError("")
                      }}
                      placeholder="Paste your marketing copy, headline, or tagline here..."
                      className="w-full p-4 border border-black/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent min-h-[200px] font-mono text-sm"
                      style={{
                        backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    {copyError && <p className="text-red-500 text-sm">{copyError}</p>}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCopySearch}
                        disabled={copyLoading}
                        className="rounded-lg bg-black text-white hover:bg-black/90 gap-2"
                      >
                        {copyLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Find Inspirations
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {showCopyResults && copyResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <h3 className="text-xl font-bold">Inspiration Results</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {copyResults.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            className="rounded-lg overflow-hidden border border-black/10 hover:border-black/30 transition-all cursor-pointer group relative"
                          >
                            <div className="aspect-video overflow-hidden bg-black/5">
                              <img
                                src={item.thumbnail || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-4">
                              <Badge variant="outline" className="rounded-md mb-2 text-xs">
                                {item.category}
                              </Badge>
                              <h4 className="font-semibold text-sm">{item.title}</h4>
                              <p className="text-xs text-black/60 mt-1">{item.description}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-3 w-full gap-2"
                                onClick={() => saveInspiration(item)}
                              >
                                <Heart className={cn("w-4 h-4", isSaved(item.id) && "fill-current")} />
                                {isSaved(item.id) ? "Saved" : "Save"}
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === "site" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Find by Site</h2>
                    <p className="text-black/60">Paste website URLs to find similar design inspirations</p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium">Website URLs</label>
                    <textarea
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value)
                        setSiteError("")
                      }}
                      placeholder="Paste one or more URLs separated by commas (e.g., stripe.com, figma.com, apple.com)"
                      className="w-full p-4 border border-black/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent min-h-[120px] font-mono text-sm"
                      style={{
                        backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                    {siteError && <p className="text-red-500 text-sm">{siteError}</p>}
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSiteSearch}
                        disabled={siteLoading}
                        className="rounded-lg bg-black text-white hover:bg-black/90 gap-2"
                      >
                        {siteLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Analyze & Find Similar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {showSiteResults && siteResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <h3 className="text-xl font-bold">Similar Designs Found</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {siteResults.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            className="rounded-lg overflow-hidden border border-black/10 hover:border-black/30 transition-all cursor-pointer group"
                          >
                            <div className="aspect-video overflow-hidden bg-black/5">
                              <img
                                src={item.thumbnail || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-4">
                              <Badge variant="outline" className="rounded-md mb-2 text-xs">
                                {item.category}
                              </Badge>
                              <h4 className="font-semibold text-sm">{item.title}</h4>
                              <p className="text-xs text-black/60 mt-1">{item.url}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-3 w-full gap-2"
                                onClick={() => saveInspiration(item)}
                              >
                                <Heart className={cn("w-4 h-4", isSaved(item.id) && "fill-current")} />
                                {isSaved(item.id) ? "Saved" : "Save"}
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === "saved" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Saved Inspirations</h2>
                    <p className="text-black/60">Your collection of favorite design inspirations</p>
                  </div>
                  {savedInspirations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {savedInspirations.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.05 }}
                          className="rounded-lg overflow-hidden border border-black/10 hover:border-black/30 transition-all cursor-pointer group relative"
                        >
                          <div className="aspect-video overflow-hidden bg-black/5">
                            <img
                              src={item.thumbnail || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <Badge variant="outline" className="rounded-md mb-2 text-xs">
                              {item.category}
                            </Badge>
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <p className="text-xs text-black/60 mt-1">{item.description || item.url}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-3 w-full gap-2 text-red-500 hover:text-red-600"
                              onClick={() => removeInspiration(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-black/10 p-12 text-center">
                      <Bookmark className="w-12 h-12 text-black/30 mx-auto mb-4" />
                      <p className="text-black/60">
                        No saved inspirations yet. Start exploring to save your favorites!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "generate" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Generate Layout</h2>
                    <p className="text-black/60">Coming soon - AI-powered layout generation</p>
                  </div>
                  <div className="rounded-lg border border-black/10 p-12 text-center">
                    <Sparkles className="w-12 h-12 text-black/30 mx-auto mb-4" />
                    <p className="text-black/60">This feature is coming soon. Stay tuned!</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
