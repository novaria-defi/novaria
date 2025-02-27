import {
  AreaSeries,
  createChart,
  ColorType,
  LineSeries,
  LineStyle,
} from "lightweight-charts"
import React, { useEffect, useRef } from "react"

export const ChartComponent = (props: any) => {
  const {
    data,

    colors: {
      backgroundColor = "transparent",
      lineColor = "blue",
      textColor = "gray",
      areaTopColor = "transparent",
      areaBottomColor = "transparent",
    } = {},
  } = props

  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const currentRef = chartContainerRef.current
    const handleResize = () => {
      chart.applyOptions({ width: currentRef.clientWidth })
    }

    const chart = createChart(currentRef, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: currentRef.clientWidth,
      height: 300,
    })

    chart.timeScale().fitContent()

    const newSeries = chart.addSeries(AreaSeries, {
      priceFormat: {
        type: "percent",
      },
      // lineColor,
      // topColor: areaTopColor,
      // bottomColor: areaBottomColor,
    })

    const lineSeries = chart.addSeries(LineSeries, {
      baseLineColor: "yellow",
      color: "yellow",
      // lineVisible: true,
      lineStyle: LineStyle.Dotted,
      priceFormat: {
        type: "percent",
      },
    })

    chart.applyOptions({
      layout: {},
      grid: {
        horzLines: { color: "green" },
        vertLines: { color: "transparent", visible: false },
      },
    })

    newSeries.setData(data)
    lineSeries.setData([
      { time: "2018-12-22", value: 10.51 },
      { time: "2018-12-23", value: 11.11 },
      { time: "2018-12-24", value: 12.02 },
      { time: "2018-12-25", value: 13.32 },
      { time: "2018-12-26", value: 14.17 },
      { time: "2018-12-27", value: 15.89 },
      { time: "2018-12-28", value: 16.46 },
      { time: "2018-12-29", value: 17.92 },
      { time: "2018-12-30", value: 18.68 },
      { time: "2018-12-31", value: 22.67 },
    ])
    window.addEventListener("resize", handleResize)

    // Remove TV logo
    const logoLink = document.getElementById("tv-attr-logo")
    if (logoLink) {
      logoLink.classList.add("hidden")
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ])

  return <div className="[&]" {...props} ref={chartContainerRef} />
}
