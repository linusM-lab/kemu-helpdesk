"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { KnowledgeBase } from "@/components/knowledge-base"

export default function KnowledgeBasePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#000000" }}>
            Knowledge Base
          </h1>
          <p style={{ color: "#666666" }}>Find answers to common questions and learn how to use university services</p>
        </div>

        <KnowledgeBase />
      </div>
    </DashboardLayout>
  )
}

