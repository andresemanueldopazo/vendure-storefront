import cn from 'clsx'
import React from 'react'
import s from './Dropdown.module.css'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export const Dropdown = DropdownMenu.Root
export const DropdownPortal = DropdownMenu.Portal
export const DropdownMenuItem = DropdownMenu.Item
export const DropdownTrigger = DropdownMenu.Trigger
export const DropdownMenuLabel = DropdownMenu.Label
export const DropdownMenuGroup = DropdownMenu.Group

export const DropdownContent = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & DropdownMenu.DropdownMenuContentProps &
    React.RefAttributes<HTMLDivElement>
>(function DropdownContent({ children, className, ...props }, forwardedRef) {
  return (
      <DropdownMenu.Content
        className={cn(s.root, className)}
        ref={forwardedRef}
        sideOffset={8}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
  )
})
