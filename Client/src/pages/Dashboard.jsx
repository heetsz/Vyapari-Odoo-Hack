import * as React from "react"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import dashboardData from "@/app/dashboard/data.json"

function App() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4">
      <SectionCards />
      <div className="grid gap-4 px-4 lg:px-6 @4xl/main:grid-cols-2">
        <ChartAreaInteractive />
      </div>
      <div className="px-4 lg:px-6">
        <DataTable data={dashboardData} />
      </div>
    </div>
  )
}

export default App
