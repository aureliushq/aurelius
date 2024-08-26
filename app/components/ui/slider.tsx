import * as React from 'react'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '~/lib/utils'

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn(
			'relative flex touch-none select-none',
			props.orientation === 'vertical'
				? 'h-full flex-col justify-center'
				: 'w-full items-center',
			className
		)}
		{...props}
	>
		<SliderPrimitive.Track
			className={cn(
				'relative grow overflow-hidden rounded-full bg-secondary',
				props.orientation === 'vertical' ? 'h-full w-2' : 'h-2 w-full'
			)}
		>
			<SliderPrimitive.Range
				className={cn(
					'absolute bg-primary',
					props.orientation === 'vertical' ? 'w-full' : 'h-full'
				)}
			/>
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb
			className={cn(
				'flex h-5 w-5 rounded-full border-2 border-primary ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50',
				'bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
				props.orientation === 'vertical' ? '-ml-1.5' : ''
			)}
		/>
	</SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
