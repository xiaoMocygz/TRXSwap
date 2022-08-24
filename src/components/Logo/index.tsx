// useState 通过在函数组件里调用它来给组件添加一些内部 state
import React, { useState } from 'react'
// react-feather是React.js的简单漂亮的开源图标的集合
import { HelpCircle } from 'react-feather'
// Rebass 是一个用于 React 的高度可组合的原始 UI 组件库
import { ImageProps } from 'rebass'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 * 通过依次尝试URI列表，然后最终返回三角形警报来渲染图像
 */
export default function Logo({ srcs, alt, ...rest }: LogoProps) {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find(src => !BAD_SRCS[src])

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh(i => i + 1)
        }}
      />
    )
  }

  return <HelpCircle {...rest} />
}
