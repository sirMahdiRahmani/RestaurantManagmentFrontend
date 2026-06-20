import type { SVGAttributes } from 'react'

export type IconName =
  | 'grid'
  | 'dish'
  | 'layers'
  | 'box'
  | 'receipt'
  | 'user'
  | 'monitor'
  | 'search'
  | 'plus'
  | 'print'
  | 'minus'
  | 'trash'

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName
  size?: number
}

const paths: Record<IconName, string> = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  dish: 'M3 12a9 9 0 0 0 18 0zM3 12a9 9 0 0 1 18 0zM12 12v-7',
  layers: 'm12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0',
  monitor: 'M4 5h16v11H4zM9 20h6M12 16v4',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  print: 'M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2M6 14h12v7H6z',
  minus: 'M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  )
}
