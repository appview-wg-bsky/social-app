import React from 'react'
import {StyleSheet, type TextProps} from 'react-native'
import Svg, {
  Defs,
  LinearGradient,
  Path,
  type PathProps,
  Stop,
  type SvgProps,
} from 'react-native-svg'

import {colors} from '#/lib/styles'

const ratio = 512 / 512

type Props = {
  fill?: PathProps['fill']
  style?: TextProps['style']
} & Omit<SvgProps, 'style'>

export const Logo = React.forwardRef(function LogoImpl(props: Props, ref) {
  const {fill, ...rest} = props
  const gradient = fill === 'sky'
  const styles = StyleSheet.flatten(props.style)
  const _fill = gradient ? 'url(#sky)' : fill || styles?.color || colors.blue3
  // @ts-ignore it's fiiiiine
  const size = parseInt(rest.width || 32)

  // const isKawaii = useKawaiiMode()

  // if (isKawaii) {
  //   return (
  //     <Image
  //       source={
  //         size > 100
  //           ? require('../../../assets/kawaii.png')
  //           : require('../../../assets/kawaii_smol.png')
  //       }
  //       accessibilityLabel="Bluesky"
  //       accessibilityHint=""
  //       accessibilityIgnoresInvertColors
  //       style={[{height: size, aspectRatio: 1.4}]}
  //     />
  //   )
  // }

  return (
    <Svg
      fill="none"
      // @ts-ignore it's fiiiiine
      ref={ref}
      viewBox="0 0 512 512"
      {...rest}
      style={[{width: size, height: size * ratio}, styles]}>
      {gradient && (
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#a3b18a" stopOpacity="1" />
            <Stop offset="1" stopColor="#344e41" stopOpacity="1" />
          </LinearGradient>
        </Defs>
      )}

      <Path
        d="M350.5 401.133L333.969 440.04L245.668 437.898L233.737 396.437L271.305 380.144L350.5 401.133Z"
        fill={_fill}
      />
      <Path
        d="M136.645 284.498C145.274 306.749 161.811 324.621 181.516 338.701C194.177 347.749 208.505 355.515 223.666 362.178L209.842 368.173L207.185 367.343C154.883 350.72 110.319 325.523 76.6169 296.567C97.5495 298.162 118.179 293.712 136.645 284.498Z"
        fill={_fill}
      />
      <Path
        d="M196.299 221.809C313.287 245.03 381.55 263.875 489.372 312.533C483.031 324.794 473.435 336.26 461.425 346.188C454.05 352.285 450.363 355.333 432.349 361C414.334 366.667 406.861 366.058 391.915 364.841C387.696 364.498 383.229 364.085 378.544 363.593C351.456 360.753 318.519 355.453 286.55 346.662C254.38 337.816 224.299 325.729 202.111 309.875C183.032 296.241 171.039 280.801 167.088 263.085C168.504 261.739 169.902 260.364 171.259 258.949L172.527 257.609C182.121 247.318 190.215 235.271 196.299 221.809Z"
        fill={_fill}
      />
      <Path
        d="M201.759 125.145C253.144 113.354 323.374 118.285 419.085 157.659C435.499 164.412 443.707 167.788 454.735 176.992C465.763 186.197 469.139 191.462 475.891 201.993C492.469 227.85 500.239 253.876 498.839 277.94C391.89 230.059 321.677 210.685 206.609 187.74C209.739 168.7 208.66 149.742 203.885 132.146L203.247 129.879C202.784 128.289 202.283 126.711 201.759 125.145Z"
        fill={_fill}
      />
      <Path
        d="M57.462 90.2697C76.0435 80.6456 97.1997 78.188 117.283 84.5704L119.651 85.3694C143.92 93.9762 161.806 114.295 169.233 139.789L169.693 141.425C174.149 157.847 174.217 176.167 168.803 194.37L168.243 196.191C163.774 210.25 156.548 222.496 147.521 232.459L145.694 234.422C123.702 257.347 92.4463 266.904 63.5671 258.33L62.1926 257.908C42.0582 251.509 26.175 237.233 16.5668 218.576C6.01774 193.259 4.12164 168.675 11.2324 146.3L11.9306 144.193C19.3598 122.686 34.8853 104.404 57.462 90.2697Z"
        fill={_fill}
      />
      <Path
        d="M151.4 61.3455C195.629 57.1643 246.553 62.3252 298.842 78.9435L304.805 80.8841C317.399 85.0916 329.546 89.8138 341.197 94.9657C279.044 80.3611 227.689 81.3073 185.278 92.7419C176.302 80.201 164.897 69.433 151.4 61.3455Z"
        fill={_fill}
      />
    </Svg>
  )
})
