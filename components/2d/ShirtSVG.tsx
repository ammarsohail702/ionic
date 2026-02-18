'use client'

import { useCustomizerStore } from '@/lib/store'

interface ShirtSVGProps {
  view: 'front' | 'back'
  width?: number
  height?: number
}

export default function ShirtSVG({ view, width = 400, height = 500 }: ShirtSVGProps) {
  const { shirt } = useCustomizerStore()

  const {
    primaryColor,
    secondaryColor,
    collarType,
    collarColor,
    sleeveType,
    sleeveDesign,
    teamName,
    playerNumber,
  } = shirt

  const isFullSleeve = sleeveType === 'full'
  const stripeColor = sleeveDesign.stripeColor
  const sleeveColor = sleeveDesign.color

  // Collar paths based on type
  const getCollarPath = () => {
    switch (collarType) {
      case 'vneck':
        return 'M 160 80 L 200 130 L 240 80'
      case 'polo':
        return 'M 155 75 Q 165 85 175 80 L 200 95 L 225 80 Q 235 85 245 75'
      case 'mandarin':
        return 'M 165 70 L 165 85 Q 200 95 235 85 L 235 70'
      default: // round
        return 'M 160 80 Q 200 110 240 80'
    }
  }

  // Sleeve stripe positions
  const getSleeveStripes = (side: 'left' | 'right') => {
    if (sleeveDesign.design === 'solid') return null

    const baseX = side === 'left' ? 45 : 310
    const stripeWidth = isFullSleeve ? 70 : 50
    const baseY = isFullSleeve ? 280 : 200

    const stripes = []
    const stripeCount = sleeveDesign.design === 'single-stripe' ? 1 :
                        sleeveDesign.design === 'double-stripe' ? 2 : 3

    for (let i = 0; i < stripeCount; i++) {
      const y = baseY + (i * 12)
      stripes.push(
        <rect
          key={`${side}-stripe-${i}`}
          x={side === 'left' ? baseX : baseX}
          y={y}
          width={stripeWidth}
          height={8}
          fill={stripeColor}
          transform={side === 'left' ? 'rotate(-15, 80, 200)' : 'rotate(15, 320, 200)'}
        />
      )
    }
    return stripes
  }

  return (
    <svg
      viewBox="0 0 400 500"
      width={width}
      height={height}
      className="drop-shadow-2xl"
    >
      <defs>
        {/* Gradient for fabric texture effect */}
        <linearGradient id="fabricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="50%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
        </filter>

        {/* Clip path for stripes on left sleeve */}
        <clipPath id="leftSleeveClip">
          <path d={isFullSleeve
            ? 'M 80 100 L 20 140 L 0 320 L 60 340 L 100 180 Z'
            : 'M 80 100 L 35 140 L 25 220 L 85 240 L 100 180 Z'
          } />
        </clipPath>

        {/* Clip path for stripes on right sleeve */}
        <clipPath id="rightSleeveClip">
          <path d={isFullSleeve
            ? 'M 320 100 L 380 140 L 400 320 L 340 340 L 300 180 Z'
            : 'M 320 100 L 365 140 L 375 220 L 315 240 L 300 180 Z'
          } />
        </clipPath>
      </defs>

      {/* Main shirt body */}
      <g filter="url(#shadow)">
        {/* Body */}
        <path
          d={`
            M 100 100
            L 100 450
            Q 200 470 300 450
            L 300 100
            Q 250 85 200 80
            Q 150 85 100 100
            Z
          `}
          fill={primaryColor}
        />

        {/* Left sleeve */}
        <path
          d={isFullSleeve
            ? 'M 100 100 L 80 100 L 20 140 L 0 320 L 60 340 L 100 180 Z'
            : 'M 100 100 L 80 100 L 35 140 L 25 220 L 85 240 L 100 180 Z'
          }
          fill={sleeveColor}
        />

        {/* Right sleeve */}
        <path
          d={isFullSleeve
            ? 'M 300 100 L 320 100 L 380 140 L 400 320 L 340 340 L 300 180 Z'
            : 'M 300 100 L 320 100 L 365 140 L 375 220 L 315 240 L 300 180 Z'
          }
          fill={sleeveColor}
        />

        {/* Fabric texture overlay */}
        <path
          d={`
            M 100 100 L 100 450 Q 200 470 300 450 L 300 100 Q 250 85 200 80 Q 150 85 100 100 Z
          `}
          fill="url(#fabricGradient)"
        />
      </g>

      {/* Sleeve stripes */}
      <g clipPath="url(#leftSleeveClip)">
        {getSleeveStripes('left')}
      </g>
      <g clipPath="url(#rightSleeveClip)">
        {getSleeveStripes('right')}
      </g>

      {/* Collar */}
      <g>
        {/* Collar base/neckline */}
        <ellipse
          cx="200"
          cy="85"
          rx="45"
          ry="25"
          fill={collarColor}
        />
        {/* Collar detail based on type */}
        {collarType === 'polo' && (
          <>
            {/* Polo collar flaps */}
            <path
              d="M 155 70 Q 160 60 175 65 L 180 80 Q 165 85 155 70 Z"
              fill={collarColor}
              stroke={secondaryColor}
              strokeWidth="1"
            />
            <path
              d="M 245 70 Q 240 60 225 65 L 220 80 Q 235 85 245 70 Z"
              fill={collarColor}
              stroke={secondaryColor}
              strokeWidth="1"
            />
            {/* Polo buttons */}
            {view === 'front' && (
              <>
                <circle cx="200" cy="110" r="4" fill={secondaryColor} />
                <circle cx="200" cy="130" r="4" fill={secondaryColor} />
                <circle cx="200" cy="150" r="4" fill={secondaryColor} />
              </>
            )}
          </>
        )}
        {collarType === 'vneck' && (
          <path
            d="M 165 80 L 200 140 L 235 80"
            fill={primaryColor}
            stroke={collarColor}
            strokeWidth="6"
          />
        )}
        {collarType === 'mandarin' && (
          <rect
            x="165"
            y="65"
            width="70"
            height="20"
            rx="3"
            fill={collarColor}
            stroke={secondaryColor}
            strokeWidth="1"
          />
        )}
        {collarType === 'round' && (
          <path
            d="M 160 85 Q 200 115 240 85"
            fill="none"
            stroke={collarColor}
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* Side seams */}
      <line x1="100" y1="180" x2="100" y2="450" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      <line x1="300" y1="180" x2="300" y2="450" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />

      {/* Text and Numbers */}
      {view === 'front' && teamName.content && teamName.position === 'front' && (
        <text
          x="200"
          y="180"
          textAnchor="middle"
          fill={teamName.color}
          fontSize={teamName.fontSize}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          style={{ textTransform: 'uppercase' }}
        >
          {teamName.content}
        </text>
      )}

      {view === 'back' && teamName.content && teamName.position === 'back' && (
        <text
          x="200"
          y="150"
          textAnchor="middle"
          fill={teamName.color}
          fontSize={teamName.fontSize}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          style={{ textTransform: 'uppercase' }}
        >
          {teamName.content}
        </text>
      )}

      {view === 'front' && playerNumber.number && playerNumber.showFront && (
        <text
          x="200"
          y="280"
          textAnchor="middle"
          fill={playerNumber.color}
          fontSize={playerNumber.fontSize * 1.2}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {playerNumber.number}
        </text>
      )}

      {view === 'back' && playerNumber.number && playerNumber.showBack && (
        <text
          x="200"
          y="300"
          textAnchor="middle"
          fill={playerNumber.color}
          fontSize={playerNumber.fontSize * 2}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {playerNumber.number}
        </text>
      )}

      {/* Hem at bottom */}
      <path
        d="M 100 445 Q 200 465 300 445"
        fill="none"
        stroke={secondaryColor}
        strokeWidth="4"
      />

      {/* Sleeve cuffs */}
      {isFullSleeve && (
        <>
          <path
            d="M 0 315 L 60 335"
            stroke={secondaryColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 400 315 L 340 335"
            stroke={secondaryColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      )}
      {!isFullSleeve && (
        <>
          <path
            d="M 25 215 L 85 235"
            stroke={secondaryColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 375 215 L 315 235"
            stroke={secondaryColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}
