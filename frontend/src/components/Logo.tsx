import React from 'react'
import data from '../logo.json'

export default function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  const { svg } = data as any
  return (
    <svg className={className} viewBox={svg.viewBox} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {svg.paths.map((p: any, i: number) => (
        <path key={i} d={p.d} opacity={p.opacity} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? 'currentColor'} strokeLinecap={p.strokeLinecap} strokeLinejoin={p.strokeLinejoin} />
      ))}
    </svg>
  )
}
